import { axiosForBackend, logger } from './index';
import type {
  BearingOrder,
  CreateOrderDto,
  OrderListResponse,
  ExchangeRateResponse,
} from '@shared/api.interface';

export async function createOrder(dto: CreateOrderDto): Promise<BearingOrder> {
  try {
    const response = await axiosForBackend.post('/orders', dto);
    return response.data;
  } catch (error) {
    logger.error('创建订单失败', error);
    throw error;
  }
}

export async function getOrderByOrderNo(orderNo: string): Promise<BearingOrder> {
  try {
    const response = await axiosForBackend.get(`/orders/lookup/${orderNo}`);
    return response.data;
  } catch (error) {
    logger.error(`查询订单失败: ${orderNo}`, error);
    throw error;
  }
}

export async function getOrderList(params: {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentStatus?: string;
  keyword?: string;
}): Promise<OrderListResponse> {
  try {
    const response = await axiosForBackend.get('/orders', { params });
    return response.data;
  } catch (error) {
    logger.error('获取订单列表失败', error);
    throw error;
  }
}

export async function getOrderById(id: string): Promise<BearingOrder> {
  try {
    const response = await axiosForBackend.get(`/orders/${id}`);
    return response.data;
  } catch (error) {
    logger.error(`获取订单详情失败: ${id}`, error);
    throw error;
  }
}

export async function updateOrder(
  id: string,
  dto: {
    status?: string;
    paymentStatus?: string;
    trackingNumber?: string;
    notes?: string;
  },
): Promise<BearingOrder> {
  try {
    const response = await axiosForBackend.patch(`/orders/${id}`, dto);
    return response.data;
  } catch (error) {
    logger.error(`更新订单失败: ${id}`, error);
    throw error;
  }
}

export async function deleteOrder(id: string): Promise<void> {
  try {
    await axiosForBackend.delete(`/orders/${id}`);
  } catch (error) {
    logger.error(`删除订单失败: ${id}`, error);
    throw error;
  }
}

export async function exportOrdersCsv(params: {
  status?: string;
  paymentStatus?: string;
  keyword?: string;
}): Promise<Blob> {
  try {
    const response = await axiosForBackend.get('/orders/export', {
      params,
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    logger.error('导出订单CSV失败', error);
    throw error;
  }
}

export async function getExchangeRate(from: string, to: string): Promise<ExchangeRateResponse> {
  try {
    const response = await axiosForBackend.get('/orders/exchange-rate', {
      params: { from, to },
    });
    return response.data;
  } catch (error) {
    logger.error('获取汇率失败', error);
    throw error;
  }
}
