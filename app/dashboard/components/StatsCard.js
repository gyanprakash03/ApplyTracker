import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlarmClock, CalendarCheck, Gift, Newspaper } from "lucide-react";

const StatsCard = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Applications Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>Total Applications</CardTitle>
            <Newspaper className="w-7 h-7 text-primary" />
          </div>
          <CardDescription>
            Applications you have submitted so far.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.total}</p>
        </CardContent>
      </Card>

      {/* Offers Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>Offers</CardTitle>
            <Gift className="w-7 h-7 text-primary" />
          </div>
          <CardDescription>Number of offers you have received.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.status.Offer}</span>
          </div>
        </CardContent>
      </Card>

      {/* Interviews Scheduled Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>Interviews Scheduled</CardTitle>
            <CalendarCheck className="w-7 h-7 text-primary" />
          </div>
          <CardDescription>Interviews you have scheduled.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.status.Interview}</span>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Deadlines Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between items-center">
            <CardTitle>Upcoming Deadlines</CardTitle>
            <AlarmClock className="w-7 h-7 text-primary" />
          </div>
          <CardDescription>
            Applications with upcoming deadlines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.upcoming}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
