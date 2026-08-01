import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ title, value }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-slate-500">
          {title}
        </p>

        <h2 className="mt-3 text-4xl font-bold">
          {value}
        </h2>
      </CardContent>
    </Card>
  );
};

export default StatsCard;