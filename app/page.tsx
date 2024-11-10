export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome to Reflection Call Evals</h1>
        
        <div className="grid gap-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <p className="text-muted-foreground">
              Evals for reflection calls.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Evaluate and track reflection call performance</li>
              <li>Provide structured feedback and ratings</li>
              <li>Monitor progress over time</li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
} 