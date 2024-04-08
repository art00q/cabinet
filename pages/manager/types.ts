import type { StatusColorValues } from "~/shared/config/status-to-color";

type OrderType = {
  [key: string]: string | number;
};

type RequestType = {
  response: {
    status: number;
    data: {
      is_s_k_alb: number;
      message: string;
      orders?: OrderType[];
      ps_title: null;
      ps_type: null;
    };
  };
};

type StatusesType = {
  [key: string]: StatusColorValues;
};

export type { RequestType, OrderType, StatusesType };
