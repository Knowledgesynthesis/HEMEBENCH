import { expect, test, type Page } from '@playwright/test'

const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' })

async function answerReport(page: Page, choice: string | RegExp, rationale: RegExp) {
  await button(page, choice).click()
  await expect(page.getByRole('status')).toContainText(rationale)
}

test('flow separates lineage, phenotype and clonal count, then repeats a missed report', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Flow cytometry/ }).click()
  const wrong = button(page, 'Both T and myeloid lineages')
  await wrong.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('status')).toContainText('Review the finding')
  await expect(page.getByRole('status')).toContainText(/CD13 can be expressed on lymphoblasts/)
  await expect(wrong).toBeDisabled()
  await expect(page.getByRole('link', { name: /WHO 5th edition/ }).first()).toHaveAttribute('href', /PMC9252913/)

  await button(page, 'Next case').click()
  await expect(page.getByRole('heading', { name: 'Weak CD19 on marrow blasts' })).toBeFocused()
  await answerReport(page, 'B-lineage criteria remain unmet', /at least two other qualifying B-lineage antigens/)
  await button(page, 'Next case').click()
  await answerReport(page, /CLL-type monoclonal/, /below 5 × 10⁹\/L/)
  await button(page, 'Next case').click()
  await answerReport(page, 'Monocytic differentiation supports myeloid lineage', /Two qualifying monocytic findings/)
  await button(page, 'Retry missed cases (1)').click()
  await expect(page.getByRole('heading', { name: 'A marrow with two apparent lineages' })).toBeVisible()
  await answerReport(page, 'T lineage', /Strong cytoplasmic CD3/)
  await button(page, 'See results').click()
  await expect(page.getByRole('heading', { name: 'Practice complete' })).toBeVisible()
  await page.getByRole('link', { name: 'Study bench', exact: true }).click()
  await expect(page.getByRole('progressbar', { name: 'Modules checked' })).toHaveAttribute('value', '1')
  await page.reload()
  await expect(page.getByRole('link', { name: /Checked Flow cytometry/ })).toBeVisible()
})

test('marker panel retains selected stains across filters and clears all together', async ({ page }) => {
  await page.goto('/#flow-cytometry')
  const filters = page.getByRole('group', { name: 'Filter stains' })
  await filters.getByRole('button', { name: 'Myeloid', exact: true }).click()
  await page.getByRole('checkbox', { name: 'MPO', exact: true }).check()
  await filters.getByRole('button', { name: 'T cell', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Cytoplasmic and surface CD3' }).check()
  await expect(page.getByRole('heading', { name: 'Selected tests (2)' })).toBeVisible()
  await filters.getByRole('button', { name: 'All', exact: true }).click()
  await expect(page.getByRole('checkbox', { name: 'MPO', exact: true })).toBeChecked()
  await button(page, 'Clear panel').click()
  await expect(page.getByRole('checkbox', { name: 'MPO', exact: true })).not.toBeChecked()
  await expect(page.getByRole('checkbox', { name: 'Cytoplasmic and surface CD3' })).not.toBeChecked()
})

test('APL workup separates emergency action, confirmation and definitive treatment', async ({ page }) => {
  await page.goto('/#case-engine')
  await button(page, /New bruising and gum bleeding/).click()
  await expect(page.getByRole('heading', { name: /while genetic results are pending/ })).toBeFocused()
  await expect(page.getByText(/RT-PCR detects the PML::RARA fusion/)).toHaveCount(0)
  await button(page, /Wait for the final karyotype/).click()
  await expect(page.getByText('Try another answer')).toBeVisible()
  await expect(button(page, 'Continue workup')).toHaveCount(0)
  await button(page, /Call hematology, start all-trans/).click()
  await expect(page.getByText(/Begin ATRA and blood-product support/)).toBeVisible()
  await button(page, 'Continue workup').click()
  await expect(page.getByText(/Flow cytometry identifies abnormal myeloid cells/)).toBeVisible()
  await button(page, /Rapid PML::RARA testing/).click()
  await button(page, 'Continue workup').click()
  await expect(page.getByText(/RT-PCR detects the PML::RARA fusion/)).toBeVisible()
  await button(page, /Use a non-high-risk APL regimen/).click()
  await expect(page.getByText(/at or below 10 × 10⁹\/L/)).toBeVisible()
  await button(page, 'Review case').click()
  await expect(page.getByText('Case complete')).toBeVisible()
  await button(page, 'Repeat case').click()
  await expect(page.getByText('Decision 1 of 3')).toBeVisible()
  await expect(page.getByText(/RT-PCR detects the PML::RARA fusion/)).toHaveCount(0)
})

test('smear atlas and unknown films offer accessible descriptions and load real images', async ({ page }) => {
  await page.goto('/#normal-smear')
  const atlas = page.getByRole('group', { name: 'Atlas structure' })
  await atlas.getByRole('button', { name: 'Monocyte', exact: true }).click()
  const image = page.getByRole('img', { name: /Monocyte.*folded/i })
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(100)
  await button(page, 'Identify unknowns').click()
  const practice = page.getByRole('region', { name: 'Smear practice' })
  const answers = ['Neutrophil', 'Platelet', 'Eosinophil', 'Monocyte', 'Erythrocyte', 'Basophil', 'Small lymphocyte']
  for (const [index, answer] of answers.entries()) {
    await expect(practice.getByRole('heading', { name: 'Unknown blood film ' + (index + 1) })).toBeVisible()
    const unknown = practice.getByRole('img', { name: /Circled structure/i })
    await expect.poll(() => unknown.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(100)
    await practice.getByRole('button', { name: answer, exact: true }).click()
    await expect(practice.getByRole('status')).toContainText('Correct')
    await practice.getByRole('button', { name: index < answers.length - 1 ? 'Next case' : 'See results' }).click()
  }
  await expect(practice.getByRole('heading', { name: 'Practice complete' })).toBeVisible()
})

test('molecular findings require cytogenetics, marrow context and quantitative monitoring', async ({ page }) => {
  await page.goto('/#molecular-panel')
  await answerReport(page, 'Intermediate', /regardless of FLT3-ITD allelic ratio/)
  await button(page, 'Next case').click()
  await answerReport(page, /Marrow morphology, including megakaryocyte architecture/, /Both diseases can carry JAK2/)
  await button(page, 'Next case').click()
  await answerReport(page, 'Assess for marrow lymphoplasmacytic lymphoma', /IgM MGUS/)
  await button(page, 'Next case').click()
  await answerReport(page, 'Quantitative BCR::ABL1 on the International Scale', /baseline transcript type guides assay selection/i)
  await button(page, 'See results').click()
  await expect(page.getByRole('heading', { name: 'Practice complete' })).toBeVisible()
  await page.getByRole('group', { name: 'Disease group' }).getByRole('button', { name: 'MPN', exact: true }).click()
  await page.getByText('JAK2 V617F', { exact: true }).click()
  await expect(page.getByText(/occurs in polycythemia vera, essential thrombocythemia and primary myelofibrosis/)).toBeVisible()
  await expect(page.getByText('FLT3-ITD', { exact: true })).toHaveCount(0)
})

test('every clinical module fits a 320px viewport and survives repeated route changes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 680 })
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  const modules = ['normal-smear', 'cbc-patterns', 'anemia-game', 'coagulation', 'flow-cytometry', 'molecular-panel', 'case-engine']
  for (const module of modules) {
    const link = page.locator('main a.module-card[href="#' + module + '"]')
    await expect(link).toHaveAccessibleName(/.+/)
    await link.click()
    await expect(page.getByRole('main')).toBeFocused()
    await expect(page.getByRole('main').getByRole('heading', { level: 1 })).toBeVisible()
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
    await page.getByRole('link', { name: 'Study bench', exact: true }).click()
  }
  await page.evaluate(ids => {
    for (let round = 0; round < 4; round++) {
      for (const id of ids) window.location.hash = id
    }
  }, modules)
  await expect(page.getByRole('heading', { name: 'Integrated cases', exact: true })).toBeVisible()
  await button(page, /Persistent high hematocrit/).click()
  await expect(page.getByText('Decision 1 of 3')).toBeVisible()
  expect(errors).toEqual([])
})

test('anemia decisions use iron stores, cell morphology and the marrow response', async ({ page }) => {
  await page.goto('/#anemia-game')
  await button(page, 'Work anemia cases').click()
  const answers = [
    'Check ferritin',
    'Vitamin B12 deficiency',
    'Investigate hemolysis',
    'Reduced erythropoietin response in kidney disease',
    'Renewed red cell production',
  ]
  for (const [index, answer] of answers.entries()) {
    await answerReport(page, answer, /^Correct/)
    await button(page, index < answers.length - 1 ? 'Next case' : 'See results').click()
  }
  await expect(page.getByRole('heading', { name: 'Practice complete' })).toBeVisible()
})

test('CBC reports distinguish absolute neutropenia, variation in size and clumped platelets', async ({ page }) => {
  await page.goto('/#cbc-patterns')
  await button(page, 'Interpret reports').click()
  await answerReport(page, 'Absolute neutropenia', /Correct/)
  await button(page, 'Next case').click()
  await answerReport(page, 'A broad spread of red cell sizes', /Correct/)
  await button(page, 'Next case').click()
  await answerReport(page, 'Check the smear for platelet clumps', /Correct/)
  await button(page, 'See results').click()
  await expect(page.getByRole('heading', { name: 'Practice complete' })).toBeVisible()
})

test('coagulation distinguishes screening times, inhibitors and evolving consumption', async ({ page }) => {
  await page.goto('/#coagulation')
  await answerReport(page, /VWF antigen, platelet-dependent/, /stabilizes factor VIII/)
  await button(page, 'Next case').click()
  await answerReport(page, /Urgent factor VIII activity/, /Bethesda assay/)
  await button(page, 'Next case').click()
  await answerReport(page, /Evaluate for evolving disseminated intravascular coagulation/, /Fibrinogen can remain in range/)
  await button(page, 'Next case').click()
  await answerReport(page, 'Factor VII', /isolated|normal aPTT/)
  await button(page, 'See results').click()
  await expect(page.getByRole('heading', { name: 'Practice complete' })).toBeVisible()

  const pt = page.getByRole('group', { name: 'PT', exact: true })
  const aptt = page.getByRole('group', { name: 'aPTT', exact: true })
  await aptt.getByRole('button', { name: 'Prolonged' }).click()
  await expect(page.getByRole('heading', { name: 'PT normal · aPTT prolonged' })).toBeVisible()
  await expect(page.getByText(/Factor XII deficiency can markedly prolong aPTT without a bleeding tendency/)).toBeVisible()
  await pt.getByRole('button', { name: 'Prolonged' }).click()
  await expect(page.getByText(/Cirrhosis and DIC can overlap/)).toBeVisible()
  await aptt.getByRole('button', { name: 'Normal' }).click()
  await expect(page.getByRole('heading', { name: 'PT prolonged · aPTT normal' })).toBeVisible()
})

test('integrated case progress persists across visits and requires three different completed workups', async ({ page }) => {
  const cases = [
    { title: /Fatigue and heavy periods/, answers: ['Serum ferritin', 'Iron deficiency is likely', 'Check hemoglobin within the first four weeks'] },
    { title: /New bruising and gum bleeding/, answers: [/Call hematology, start all-trans/, /Rapid PML::RARA testing/, /Use a non-high-risk APL regimen/] },
    { title: /Persistent high hematocrit/, answers: [/Assess secondary causes/, 'Polycythemia vera', 'Below 45%'] },
  ]
  await page.goto('/#case-engine')
  const order = [0, 0, 1, 2]
  for (const [index, caseIndex] of order.entries()) {
    const workup = cases[caseIndex]
    await button(page, workup.title).click()
    for (const [step, answer] of workup.answers.entries()) {
      await button(page, answer).click()
      await button(page, step < 2 ? 'Continue workup' : 'Review case').click()
    }
    await button(page, 'Choose another case').click()
    const completed = index === 0 ? 1 : index
    await expect(page.getByText(completed + ' of 3 cases complete', { exact: true })).toBeVisible()
    await page.getByRole('link', { name: 'Study bench', exact: true }).click()
    await expect(page.getByRole('progressbar')).toHaveAttribute('value', caseIndex === 2 ? '1' : '0')
    await page.reload()
    await page.getByRole('link', { name: /Integrated cases/ }).click()
    await expect(page.getByText(completed + ' of 3 cases complete', { exact: true })).toBeVisible()
  }
})

test('CBC uses inclusive adult MCV categories and the selected hemoglobin interval', async ({ page }) => {
  await page.goto('/#cbc-patterns')
  const hb = page.getByRole('slider', { name: 'Hemoglobin', exact: true })
  const mcv = page.getByRole('slider', { name: 'MCV', exact: true })
  await hb.focus()
  for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowLeft')
  await expect(hb).toHaveValue('12')
  const hemoglobinRow = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Hemoglobin', exact: true }) })
  await expect(hemoglobinRow).toContainText('In range')
  await page.getByRole('combobox', { name: 'Adult reference profile' }).selectOption('male')
  await expect(hemoglobinRow).toContainText('Low')

  await mcv.focus()
  for (let i = 0; i < 11; i++) await page.keyboard.press('ArrowLeft')
  await expect(mcv).toHaveValue('79')
  await expect(page.getByRole('status')).toContainText('Microcytic anemia')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('status')).toContainText('Normocytic anemia')
  for (let i = 0; i < 20; i++) await page.keyboard.press('ArrowRight')
  await expect(mcv).toHaveValue('100')
  await expect(page.getByRole('status')).toContainText('Normocytic anemia')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('status')).toContainText('Macrocytic anemia')
})

test('CBC calculates relative counts from absolute counts and handles a zero denominator', async ({ page }) => {
  await page.goto('/#cbc-patterns')
  await button(page, 'Low neutrophil count').click()
  const total = page.getByRole('row').filter({ has: page.getByRole('rowheader', { name: 'Total WBC' }) })
  await expect(total).toContainText('3.74')
  await expect(total).toContainText('In range')
  await expect(page.getByRole('status')).toContainText('Low neutrophils')
  await page.getByText('Edit absolute white cell counts').click()
  for (const lineage of ['Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils', 'Basophils']) {
    await page.getByRole('slider', { name: lineage }).press('Home')
  }
  await expect(total).toContainText('0 × 10⁹/L')
  await expect(page.getByText(/no WBCs/)).toHaveCount(5)
  await expect(page.getByRole('main')).not.toContainText(/NaN|Infinity/)
  await button(page, 'Baseline').click()
  await expect(page.getByText(/no WBCs/)).toHaveCount(0)
  await expect(page.getByRole('status')).toContainText('within the selected intervals')
})
