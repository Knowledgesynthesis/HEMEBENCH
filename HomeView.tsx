// React import not needed with new JSX transform
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './Card'
import { Button } from './Button'
import { useAppStore } from './store'
import {
  Microscope,
  Activity,
  Target,
  Dna,
  Droplets,
  FlaskConical,
  BookOpen,
  TrendingUp
} from 'lucide-react'

export function HomeView() {
  const setCurrentView = useAppStore((state) => state.setCurrentView)

  const modules = [
    {
      id: 'normal-smear' as const,
      title: 'Normal Smear Foundations',
      description: 'Master normal blood cell morphology and identification',
      icon: <Microscope className="w-8 h-8 text-primary" />,
      level: 'Foundational',
    },
    {
      id: 'cbc-patterns' as const,
      title: 'CBC Patterns Explorer',
      description: 'Interactive CBC interpretation with pattern recognition',
      icon: <Activity className="w-8 h-8 text-primary" />,
      level: 'Intermediate',
    },
    {
      id: 'anemia-game' as const,
      title: 'Anemia 2×2 Game',
      description: 'Pattern-based anemia classification using MCV and reticulocyte count',
      icon: <Target className="w-8 h-8 text-primary" />,
      level: 'Intermediate',
    },
    {
      id: 'flow-cytometry' as const,
      title: 'Flow Cytometry Viewer',
      description: 'Learn lineage markers and immunophenotyping patterns',
      icon: <Droplets className="w-8 h-8 text-primary" />,
      level: 'Advanced',
    },
    {
      id: 'molecular-panel' as const,
      title: 'Molecular Panel Explorer',
      description: 'Understand key mutations in hematologic malignancies',
      icon: <Dna className="w-8 h-8 text-primary" />,
      level: 'Advanced',
    },
    {
      id: 'coagulation' as const,
      title: 'Coagulation Patterns',
      description: 'Master PT/PTT interpretation and coagulation disorders',
      icon: <FlaskConical className="w-8 h-8 text-primary" />,
      level: 'Intermediate',
    },
    {
      id: 'case-engine' as const,
      title: 'Integrated Case Engine',
      description: 'Full diagnostic workups combining morphology, labs, flow, and molecular',
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      level: 'Advanced',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center space-y-2 px-4 pt-6">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          HemeBench
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Master hematopathology through integrated morphology, CBC interpretation, flow cytometry, and molecular diagnostics
        </p>
      </div>

      <div className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card
            key={module.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => setCurrentView(module.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {module.icon}
                </div>
                <span className="text-xs px-2 py-1 bg-accent rounded-full text-muted-foreground">
                  {module.level}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              >
                Start Learning →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mx-4 bg-gradient-to-r from-blue-500/10 to-purple-600/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <CardTitle className="text-lg">Learning Path</CardTitle>
          </div>
          <CardDescription>
            Start with Normal Smear Foundations, then progress through CBC Patterns and Anemia Classification.
            Advanced learners can dive into Flow Cytometry, Molecular Panels, and Integrated Cases.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="text-center text-sm text-muted-foreground px-4 pb-24 md:pb-6">
        <p>Offline-ready • Mobile-optimized • Based on WHO Classification & CAP Guidelines</p>
      </div>
    </div>
  )
}
