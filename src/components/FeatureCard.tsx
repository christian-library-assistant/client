import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card border-secondary/20 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className="mb-2 p-3 bg-primary/10 rounded-full w-fit">{icon}</div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
