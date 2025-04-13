
import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InsightCardProps {
  title: string;
  content: string;
  icon: ReactNode;
  type: "innovation" | "industry" | "problem" | "solution" | "funding" | "market";
}

const InsightCard = ({ title, content, icon, type }: InsightCardProps) => {
  return (
    <Card className="overflow-hidden border-t-4" style={{ borderTopColor: `var(--insight-${type})` }}>
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <div className={`p-1 rounded-md bg-insight-${type}/10`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line">{content}</p>
      </CardContent>
    </Card>
  );
};

export default InsightCard;
