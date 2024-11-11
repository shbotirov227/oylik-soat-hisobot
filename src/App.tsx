import { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Trash2 } from 'lucide-react';
import "./index.css";

const App = () => {
    const [workDays, setWorkDays] = useState(() => {
        const saved = localStorage.getItem('workDays');
        return saved ? JSON.parse(saved) : [];
    });

    const [formData, setFormData] = useState({
        date: '',
        startTime: '',
        endTime: ''
    });

    const [error, setError] = useState('');
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        localStorage.setItem('workDays', JSON.stringify(workDays));
    }, [workDays]);

    const calculateHours = (startTime: any, endTime: any) => {
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const start = startHours * 60 + startMinutes;
        const end = endHours * 60 + endMinutes;

        return Number(((end - start) / 60));
    };

    const isValidTimeFormat = (time: any) => {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setError('');

        if (!formData.date || !formData.startTime || !formData.endTime) {
            setError("Iltimos, barcha maydonlarni to'ldiring!");
            return;
        }

        if (!isValidTimeFormat(formData.startTime) || !isValidTimeFormat(formData.endTime)) {
            setError("Vaqt formati noto'g'ri! HH:MM formatida kiriting (masalan: 09:00)");
            return;
        }

        const hours = calculateHours(formData.startTime, formData.endTime);

        if (hours < 0) {
            setError("Ketish vaqti kelish vaqtidan katta bo'lishi kerak!");
            return;
        }

        setWorkDays((prev: any) => [...prev, {
            id: Date.now(),
            ...formData,
            hours
        }]);

        setFormData({
            date: '',
            startTime: '',
            endTime: ''
        });
    };

    const handleDelete = () => {
        setWorkDays((prev: any) => prev.filter((day: any) => day.id !== selectedId));
        setSelectedId(null);
    };

    const totalHours = workDays.reduce((sum: any, day: any) => sum + day.hours, 0);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-md mb-6 p-6 border">
                <h2 className="text-2xl font-semibold mb-6">Ish vaqtini hisoblash</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Sana</label>
                            <input
                                type="text"
                                name="date"
                                placeholder="01"
                                value={formData.date}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Kelish vaqti</label>
                            <input
                                type="text"
                                name="startTime"
                                placeholder="09:00"
                                value={formData.startTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Ketish vaqti</label>
                            <input
                                type="text"
                                name="endTime"
                                placeholder="18:00"
                                value={formData.endTime}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-center text-white py-2 rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        Qo'shish
                    </button>
                </form>

                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600">{error}</p>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border">
                <h2 className="text-2xl font-semibold mb-6">Oylik hisobot</h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Sana</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Kelish</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Ketish</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Soat</th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {workDays.map((day: any) => (
                                <tr key={day.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.startTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.endTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{day.hours}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Dialog.Root>
                                            <Dialog.Trigger asChild>
                                                <button
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                    onClick={() => setSelectedId(day.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </Dialog.Trigger>
                                            <Dialog.Portal>
                                                <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                                                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-[300px]">
                                                    <Dialog.Title className="text-lg font-medium mb-4">
                                                        Tasdiqlash
                                                    </Dialog.Title>
                                                    <Dialog.Description className="text-gray-500 mb-6">
                                                        Bu ma'lumotni o'chirmoqchimisiz?
                                                    </Dialog.Description>
                                                    <div className="flex justify-end gap-4">
                                                        <Dialog.Close asChild>
                                                            <button className="px-4 py-2 text-gray-500 hover:text-gray-700">
                                                                Bekor qilish
                                                            </button>
                                                        </Dialog.Close>
                                                        <Dialog.Close asChild>
                                                            <button
                                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                                onClick={handleDelete}
                                                            >
                                                                O'chirish
                                                            </button>
                                                        </Dialog.Close>
                                                    </div>
                                                </Dialog.Content>
                                            </Dialog.Portal>
                                        </Dialog.Root>
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-gray-50">
                                <td colSpan={3} className="px-6 py-4 text-right font-medium">
                                    Jami:
                                </td>
                                <td className="px-6 py-4 font-medium">
                                    {totalHours.toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default App;