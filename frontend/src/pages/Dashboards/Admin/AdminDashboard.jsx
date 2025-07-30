import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import { Users, CalendarDays } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

import { getUserStats } from '../../../redux/usersSlice';
import { getEventStats } from '../../../redux/eventSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    totalUsers,
    usersGrowth,
    loading: userLoading,
    error: userError
  } = useSelector((state) => state.usersState);

  const {
    stats: { totalEvents, eventsGrowth },
    loading: eventLoading,
    error: eventError
  } = useSelector((state) => state.eventState);

  useEffect(() => {
    dispatch(getUserStats());
    dispatch(getEventStats());
  }, [dispatch]);

  const formatMonthlyData = (rawData) =>
    Array.from({ length: 12 }, (_, i) => {
      const found = rawData.find((m) => m._id === i + 1);
      return {
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        count: found ? found.count : 0
      };
    });

  const formattedUserGrowth = formatMonthlyData(usersGrowth);
  const formattedEventGrowth = formatMonthlyData(eventsGrowth);

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">Admin Dashboard</h2>

      {(userLoading || eventLoading) && <p>Loading stats...</p>}
      {(userError || eventError) && (
        <p className="text-danger">
          Error: {userError || eventError}
        </p>
      )}

      <div className="d-flex flex-wrap gap-4 mb-4">
        <Card className="flex-grow-1 shadow rounded-4 p-3 text-center card-metric">
          <Users size={32} className="text-primary mb-2" />
          <h4 className="mb-1">Total Users</h4>
          <h2 className="fw-bold">{totalUsers}</h2>
        </Card>

        <Card className="flex-grow-1 shadow rounded-4 p-3 text-center card-metric">
          <CalendarDays size={32} className="text-success mb-2" />
          <h4 className="mb-1">Total Events</h4>
          <h2 className="fw-bold text-success">{totalEvents}</h2>
        </Card>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <Card className="shadow rounded-4 p-3 h-100">
            <h4 className="mb-3">User Growth (Last 12 Months)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedUserGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#111518ff"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="col-md-6 mb-4">
          <Card className="shadow rounded-4 p-3 h-100">
            <h4 className="mb-3">Event Growth (Last 12 Months)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formattedEventGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#28a745"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
