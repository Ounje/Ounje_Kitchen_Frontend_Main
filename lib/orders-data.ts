export type OrderPeriod = 'daily' | 'monthly' | 'yearly';
export type OrderStatus = 'active' | 'delivered' | 'rejected';

export interface Order {
  id: string;
  orderName: string;
  totalAmount: number;
  vendorName: string;
  vendorId: string;
  orderId: string;
  foodImage: string;
  customerName: string;
  customerAddress: string;
  riderName: string;
  riderZone: string;
  status: OrderStatus;
  amountPaid: number;
  createdAt: Date;
  month?: string;
  year?: number;
  dateGroup?: string;
}

const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  const vendors = ['Iya Bolu', 'Madu South', 'John Cena', 'Maria Garcia'];
  const customerNames = ['Madu South', 'Iya Bolu', 'John Smith', 'Maria Gonzalez'];
  const riderNames = ['Yusuf Ahmed', 'Chioma Obi', 'Samuel Johnson', 'Amina Hassan'];
  const zones = ['Yaba Zone', 'Ikeja Zone', 'V.I Zone', 'Lekki Zone'];
  const foods = [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1577003832033-a53e62b9a997?w=300&h=200&fit=crop',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
  ];

  for (let i = 1; i <= 70; i++) {
    const date = new Date(2025, 9, Math.floor(Math.random() * 28) + 1);
    const status: OrderStatus = ['active', 'delivered', 'rejected'][i % 3] as OrderStatus;
    
    orders.push({
      id: `order_${i}`,
      orderName: "South's Order",
      totalAmount: 5600,
      vendorName: vendors[Math.floor(Math.random() * vendors.length)],
      vendorId: `vendor_${i}`,
      orderId: `OUN - ${String(i).padStart(3, '0')} - 7D5T`,
      foodImage: foods[Math.floor(Math.random() * foods.length)],
      customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
      customerAddress: '9, Banjo Street, Yaba Lagos',
      riderName: riderNames[Math.floor(Math.random() * riderNames.length)],
      riderZone: zones[Math.floor(Math.random() * zones.length)],
      status: status,
      amountPaid: 5600,
      createdAt: date,
      month: date.toLocaleString('default', { month: 'long', year: 'numeric' }),
      year: date.getFullYear(),
      dateGroup: date.toLocaleString('default', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    });
  }

  return orders;
};

export const allOrders = generateOrders();

export const getOrdersByPeriod = (period: OrderPeriod, status: OrderStatus): Order[] => {
  const filtered = allOrders.filter((order) => order.status === status);

  if (period === 'daily') {
    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  if (period === 'monthly') {
    return filtered.sort((a, b) => {
      const dateA = new Date(b.createdAt);
      const dateB = new Date(a.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
  }

  if (period === 'yearly') {
    return filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
  }

  return filtered;
};

export const groupOrdersByPeriod = (
  orders: Order[],
  period: OrderPeriod
): Record<string, Order[]> => {
  const grouped: Record<string, Order[]> = {};

  orders.forEach((order) => {
    let key: string;

    if (period === 'daily') {
      key = order.dateGroup || 'Unknown Date';
    } else if (period === 'monthly') {
      key = order.month || 'Unknown Month';
    } else {
      key = String(order.year || 'Unknown Year');
    }

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(order);
  });

  return grouped;
};
