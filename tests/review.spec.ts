import { expect, test, type Page } from '@playwright/test'
import { reviewItems } from '../reviewItems'

async function currentQuestion(page: Page) {
  const region = page.getByRole('region', { name: 'Current question' })
  const prompt = await region.getByRole('heading', { level: 2 }).innerText()
  const item = reviewItems.find(question => question.prompt === prompt)
  if (!item) throw new Error('Unexpected review prompt: ' + prompt)
  return { item, choices: region.getByRole('group', { name: 'Answer choices' }).getByRole('button') }
}

test('complete a mixed round, reload a graded answer, recover a miss, and see fresh questions', async ({ page }) => {
  await page.goto('/#review')
  await page.getByRole('button', { name: 'Start mixed round' }).click()
  const firstRound = new Set<string>()
  for (let i = 0; i < 7; i++) {
    const { item, choices } = await currentQuestion(page)
    expect(firstRound.has(item.module)).toBe(false)
    firstRound.add(item.module)
    const selected = i === 0 ? (item.answer + 1) % item.options.length : item.answer
    await choices.nth(selected).click()
    if (i === 0) await page.reload()
    await expect(choices.nth(selected)).toBeDisabled()
    await expect(page.getByRole('status')).toContainText(item.options[selected].feedback)
    await expect(page.getByRole('link', { name: item.source.title })).toHaveAttribute('href', item.source.url)
    await page.getByRole('button', { name: i === 6 ? 'See results' : 'Next question' }).click()
  }
  await expect(page.getByRole('heading', { name: '6 of 7 correct' })).toBeVisible()
  const previousPrompts = await page.locator('.review-results summary').allTextContents()
  await page.getByRole('button', { name: 'Retry missed (1)' }).click()
  const { item, choices } = await currentQuestion(page)
  await choices.nth(item.answer).click()
  await page.getByRole('button', { name: 'See results' }).click()
  await expect(page.getByRole('heading', { name: '1 of 1 correct' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Retry missed/ })).toHaveCount(0)
  await page.getByRole('button', { name: 'New mixed round' }).click()
  for (let i = 0; i < 7; i++) {
    const next = await currentQuestion(page)
    expect(previousPrompts.some(prompt => prompt.includes(next.item.prompt))).toBe(false)
    await next.choices.nth(next.item.answer).click()
    await page.getByRole('button', { name: i === 6 ? 'See results' : 'Next question' }).click()
  }
  await expect(page.getByRole('heading', { name: '7 of 7 correct' })).toBeVisible()
})

test('blocked browser storage still supports practice, navigation and preferences', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError') } })
  })
  await page.goto('/')
  await page.getByRole('link', { name: 'Learning settings' }).click()
  await page.getByRole('switch', { name: 'Practice hints' }).click()
  await expect(page.getByRole('switch', { name: 'Practice hints' })).not.toBeChecked()
  await page.getByRole('link', { name: 'Mixed review', exact: true }).click()
  await page.getByRole('button', { name: 'Start mixed round' }).click()
  const { item, choices } = await currentQuestion(page)
  await choices.nth(item.answer).click()
  await page.goBack()
  await expect(page.getByRole('switch', { name: 'Practice hints' })).not.toBeChecked()
  await page.goForward()
  await expect(page.getByRole('status')).toContainText(item.options[item.answer].feedback)
})

test('damaged saved state, obsolete routes, and reloads leave the bench usable', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('hemebench.v2.completed', '["unknown","cbc-patterns","cbc-patterns",9]')
    localStorage.setItem('hemebench.v2.review', '{"round":{"ids":[null],"index":22},"missed":[null,8]}')
    localStorage.setItem('hemebench.v2.hints', '{broken')
  })
  await page.goto('/#old-link')
  await page.reload()
  await expect(page.getByRole('progressbar', { name: 'Modules checked' })).toHaveAttribute('value', '1')
  await page.getByRole('button', { name: 'Special studies' }).click()
  await expect(page.locator('.module-card')).toHaveCount(3)
  await page.getByRole('link', { name: 'Mixed review', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Start mixed round' })).toBeVisible()
  await page.getByRole('link', { name: 'Learning settings' }).click()
  await expect(page.getByRole('switch', { name: 'Practice hints' })).toBeChecked()
  await page.getByRole('switch', { name: 'Dark appearance' }).click()
  await page.reload()
  await expect(page.locator('html')).toHaveClass(/dark/)
})

test('cached production build supports a fresh offline visit to a different module', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
    if (!navigator.serviceWorker.controller) {
      await new Promise<void>(resolve => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }))
    }
  })
  await context.setOffline(true)
  await page.reload()
  await page.getByRole('link', { name: 'Start with the smear' }).click()
  await expect(page.getByRole('heading', { name: 'Peripheral smear', exact: true })).toBeVisible()
  const photo = page.locator('main img:visible').first()
  await expect.poll(() => photo.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(100)
  await page.getByRole('link', { name: 'Mixed review', exact: true }).click()
  await page.getByRole('button', { name: 'Start mixed round' }).click()
  const { item, choices } = await currentQuestion(page)
  await choices.nth(item.answer).click()
  await expect(page.getByRole('status')).toContainText('Correct')
})
