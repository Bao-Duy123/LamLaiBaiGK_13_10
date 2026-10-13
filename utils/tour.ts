// utils/tour.ts
export interface Tour {
    id: string;
    name: string;
    city: string;
    days: number;
    price: number;
    seats: number;
    departure: string;
    image: string;
    isFavorite: boolean;
  }
  
  export const formatDate = (dateString: string): string => {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return dateString;
  };
  
  export const getSeatLabel = (seats: number): string => {
    if (seats === 0) return "Hết chỗ";
    if (seats >= 1 && seats <= 3) return `Chỉ còn ${seats} chỗ`;
    return `Còn ${seats} chỗ`;
  };
  
  export const groupByCity = (tours: Tour[]) => {
    const grouped = tours.reduce((acc, tour) => {
      if (!acc[tour.city]) acc[tour.city] = [];
      acc[tour.city].push(tour);
      return acc;
    }, {} as Record<string, Tour[]>);
  
    return Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map(city => {
        const cityTours = grouped[city].sort(
          (a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime()
        );
        return { title: city, data: cityTours };
      });
  };