import EconomicCalendar from '@/components/calendar/EconomicCalendar';

export default function CalendarPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <EconomicCalendar />
                </div>
            </div>
        </div>
    );
}
