import { create } from "zustand";

interface AppState {
  totalTime: number;
  totalPrice: number;
  rate: number;
  QRCodeData: string;
  pixCode: string;
  rentalid: any;
  endTime: Date;
  isRunning: boolean;
  returnToPaymentResponse: boolean;
  setReturnToPaymentResponse: (returnToPaymentResponse: boolean) => void;
  setIsRunning: (isRunning: boolean) => void;
  setEndTime: (time: Date) => void;
  setRentalid: (id: any) => void;
  setPixCode: (code: string) => void;
  clearTime: () => void;
  clearPrice: () => void;
  setRate: (rate: number) => void;
  setQRCodeData: (data: string) => void;
  setTime: (timeToAdd: number) => void;
  setPrice: (priceToAdd: number) => void;
  decrementTime: () => void;
}

const useStore = create<AppState>((set) => ({
  totalTime: 0,
  totalPrice: 0.0,
  rate: 0.25,
  QRCodeData: "",
  pixCode: "",
  rentalid: null,
  //   endTime: new Date(),
  endTime: new Date("2024-06-09T03:30:00.000000"),
  isRunning: false,
  returnToPaymentResponse: false,
  setReturnToPaymentResponse: (returnToPaymentResponse) =>
    set({ returnToPaymentResponse: returnToPaymentResponse }),
  setIsRunning: (isRunning) => set({ isRunning: isRunning }),
  setEndTime: (time) => set({ endTime: time }),
  setRentalid: (id) => set({ rentalid: id }),
  setPixCode: (code) => set({ pixCode: code }),
  clearTime: () => set({ totalTime: 0 }),
  clearPrice: () => set({ totalPrice: 0.0 }),
  setRate: (rate) => set({ rate: rate }),
  setQRCodeData: (data) => set({ QRCodeData: data }),
  setTime: (timeToAdd) => set({ totalTime: timeToAdd }),
  setPrice: (priceToAdd) =>
    set({ totalPrice: parseFloat(priceToAdd.toString()) }),
  decrementTime: () => set((state) => ({ totalTime: state.totalTime-- })),
}));

export default useStore;
