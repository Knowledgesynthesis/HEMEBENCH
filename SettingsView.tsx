// React import not needed with new JSX transform
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { ArrowLeft, Info } from 'lucide-react'
import { useAppStore } from './store'

export function SettingsView() {
  const { setCurrentView, showHints, toggleHints, difficulty, setDifficulty } = useAppStore()

  return (
    <div className="space-y-4 p-4 pb-24 md:pb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Customize your learning experience
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Learning Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Difficulty Level</span>
              <span className="text-sm text-muted-foreground">{difficulty}</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={difficulty === 'beginner' ? 'default' : 'outline'}
                onClick={() => setDifficulty('beginner')}
              >
                Beginner
              </Button>
              <Button
                size="sm"
                variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                onClick={() => setDifficulty('intermediate')}
              >
                Intermediate
              </Button>
              <Button
                size="sm"
                variant={difficulty === 'advanced' ? 'default' : 'outline'}
                onClick={() => setDifficulty('advanced')}
              >
                Advanced
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Show Hints</span>
              <p className="text-sm text-muted-foreground">
                Display learning tips and clinical pearls
              </p>
            </div>
            <Button
              size="sm"
              variant={showHints ? 'default' : 'outline'}
              onClick={toggleHints}
            >
              {showHints ? 'On' : 'Off'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">About HemeBench</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Version:</strong> 1.0.0
          </p>
          <p>
            HemeBench is an interactive hematopathology learning platform designed for medical students, residents, and fellows.
          </p>
          <p>
            <strong className="text-foreground">Features:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Offline-capable progressive web app</li>
            <li>Mobile-first responsive design</li>
            <li>Dark mode optimized</li>
            <li>Pattern-based learning approach</li>
            <li>Integrated morphology + labs + molecular</li>
          </ul>
          <p>
            <strong className="text-foreground">Standards:</strong> Content aligned with WHO Hematolymphoid Tumor Classification and CAP Hematopathology Guidelines.
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardHeader>
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <CardTitle className="text-lg">Disclaimer</CardTitle>
              <CardDescription className="mt-2">
                This application is for educational purposes only. It is not intended to replace clinical judgment, laboratory testing, or professional medical consultation. Always verify diagnoses with appropriate clinical and laboratory evaluation.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Navigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setCurrentView('glossary')}
          >
            View Glossary →
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setCurrentView('home')}
          >
            Return to Home →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
