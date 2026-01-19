import axiosInstance from "@/lib/axios";
import type { Invoice, InvoiceDetail } from "@/types/invoice";

// nao chi can sua service là xong
export const getInvoices = async () => {
  const response = await axiosInstance.get("/invoices");
  return response.data.data as Invoice[];
};
export const createInvoiceByAdmin = async (data: {
  waterIndex: number;
  electricityIndex: number;
  apartmentId: number;
  period: string;
}) => {
  const response = await axiosInstance.post("/invoices/admin", data);
  return response.data.data as Invoice;
};
export const updateInvoice = async ({
  data,
  id,
}: {
  id: number;
  data: {
    waterIndex: number;
    electricityIndex: number;
    apartmentId: number;
    period: string;
  };
}) => {
  console.log("Updating invoice with data:", data);
  const response = await axiosInstance.patch(`/invoices/${id}`, data);
  return response.data.data as Invoice;
};
export const deleteInvoice = async (id: number) => {
  const response = await axiosInstance.delete(`/invoices/${id}`);
  return response.data.data as Invoice;
};

export const deleteManyInvoices = async (ids: number[]) => {
  const response = await axiosInstance.post(`/invoices/delete-many`, { ids });
  return response.data;
};

export const getInvoiceById = async (id: number) => {
  const response = await axiosInstance.get(`/invoices/${id}`);
  return response.data.data as InvoiceDetail;
};

export const verifyInvoice = async (data: {
  invoiceId: number;
  meterReadings: {
    feeTypeId: number;
    newIndex: number;
  }[];
}) => {
  const response = await axiosInstance.post(`/invoices/verify-invoice-readings`, data);
  return response.data.data as Invoice;
};
const invoicesMadeByClient: InvoiceDetail[] = [
  {
    id: 1,
    invoiceCode: "INV-202401-A101",
    apartmentId: 12,
    period: "2024-01-01",
    totalAmount: "1500000",
    status: "UNPAID",
    imageUrl:
      "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUSExMVFhUXFRUXFRcVFRUVFxUVFxcWFhUXFRUYHSggGB0lHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGC0dHx0tLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0rLS0tLS0tLS03LS0tLS0tLf/AABEIAOwA1gMBIgACEQEDEQH/xAAbAAABBQEBAAAAAAAAAAAAAAACAAEDBAUGB//EAEAQAAEDAQUFBgQEBAYBBQAAAAEAAhEDBBIhMUEFUWFxgQYiMpGhsRPB0fAjQuHxFFJicgczgpKywrMVJFNzov/EABkBAAMBAQEAAAAAAAAAAAAAAAACBAEDBf/EACMRAAICAgICAwEBAQAAAAAAAAABAhEDIRIxBFETIjJBYRT/2gAMAwEAAhEDEQA/APPSdFDVMCY/dSxOKhqGYHGegUtl7BpMgAT+6e6iTwizaIalnBxGCr1KZBMg4rQLecb0Xw8Mr3ms5BRlOZ7D1RRkNytV7GcxjvGoVcN1x1TWNQ137hE0Z8t36omtw6yheQNcdBGaxbdDOkrY1wamEHxIIjQzj9E1wnH73+2KYBd44/ZJPO3+RXjvSE7z5p4SXTijlyl7DFSYB3AT9VKaUdeKgAQlh/KSPbyXKWL0d4Z2u9lq5geaD4ZRWSpekHBwzHzCm+Fn9eKndp0ynUlaK7W58iobp4q06lwQCmQR19lqkLxK4BkZoSSnuHilB4pxaBJKTlJUmTzQgFAtAkpHRTmg7P8AdHSpggSiwKhSWgGcEkWBcLccFEzEk78ByGaH+JkHicOBU9Jo6AdSk6GWwalOEN1ETz6pBiWxqHYNNNf3Rg6dMNykoU8eiMUI0wnVLZqQJwE65KCtZZE6++/qrxp+QxQ1DiA0d7jkOKyxqMRxAEqqTJkrR2vSDQAMe9nvw/VZwVmFask8iT5cQ2vgffOPPHySbnj1QtEmBwA5/ZCbEEg5jPzP0XYnClE5hHkDynKUCIPO/MDyiB6LQEEQGqBS0qkDyPUE578CQsZpDUJBDhmPv75rVpsvNDhkROYWbXOHkFp7DYTTdwdh6FS+QtWV+K3y4+wX08+R1CqmiTkPZaVWkdw80JbDQcMzqNxU8ZFkoUZYYZHMIC0ypxRlWKdlAxPkuvI4NFZllOZVltOBgpShci7EoiOKGgBJHVSOCidgZWoVkoGKSV5OtNOfZXO9XKO0CM1nhOV2aTJVJo6GzWtpzwnyV1ka4Rlx/RcpSqkLX2ftCMMxuPyXGWP0d4Zf4zWgg4+isU3wN6rX2uhwA+9CETn3c/3XApRJUqEQI7xyj35I6NK7iTJOLj7BKlSjE+IxMaDRoUwAAxnjzWM6RiY+2mXnRo1peY4loA8x7rHJy8/T9l1VosgLHb3ljQdzZAA8y49Vz+zLCatZtMAkY3oEkMEFxiRoDqFXhkuJF5MHzv2X+zezy+0tYcCIeQc8gQY3AG90G9ZzLOXNpnI1HPjl+GPQly6e22CrTqOfUHffVaaVSjLrjqbO7epH8VjYaZJkRII1UlHZt2hYXG6Caz5lpcBLXOILWwY/DdgFvKnYnDVHJij+EasYBzWg82uc4f8ADzTW+zmk4sMy0gGc9FfBeLG6kQy78QPBh5qOOFMxoBhqJzwWt2o2WatSk4vYH1ZpmGOY0PAJpCHEmXHukzoE3PYrho5YFGComHKcDjgcwdZSY4ktiTJMAYknIADU4rpZzQdQzhx+/ddD2dltJxwgu+QG7fKw61mfTcWVGlr2+JpzBInHoQuosVANpBuPhbpkfEdd5Kj8qX1r2eh4GNubfojtT53DAjXM9FWNmc5gugGCSSr1Kxl5gHDXCFdNKG3RlwyUkZUejkiYNGzgCcyk5iv14Y6fynMfyn6INMAuqZHJFJzYUJVqpKhfEJ0cmiBA9k4KyGmIUL3tbmYTpiOkR0yYnoeYzSVGttAAm7iDjjv1ST8Wc+cTMSSSXY4CRtchThYBpWG3RgStmz1Z7xAJOX9P6rmLq0LBaSDiuM4/1FGKdaZ0VKvwVxmUg57/AKLKstQOxHqr1F0GQppIugy4y6QJnMExwMj2U/YiwXLQ5xA/yAON6+1z/VwHRVGz5rY7PPu1Wz+YFvKcR6tA6pYya17GyQTV+jV7SVmCmWGSSJgEiB/MYzywGpHAqyzY7TTpU3E9zE3TF5xa5r5OcG+/IjNR2+wNNanUORc0O3S03qd7mYb1A1W01PelRM1s5et2PpEOADXXhHfYCWi8Xdx2gxOBBnepdo9mKb4cwNY/4tF7nBlO84UyBAIbDe5ewAgnNdJCYhNzl7F4R9Hjva3Zgp1q7wIaKzGgCAPxKJrPPmB5rS7J2BlLF7fx77GtcILqLalJlS8GOMXvxIBg5OziD1XafYbaoY3/AOS1U3P/ALRSLHD/AGs9VS21Vo0H1K7qrHm8C2i2A6+1rWtZIJgd2XGJieC687jRzWOpWct2nssV6YJlzmhr9TLKtSk1xJmZaxuZnurYbRvGBPl+qwbHftFSpXqG86WOJ/qvAgDgGsLQN0LsbDRDWFxEl0hvAalSeVOqR6ngw+rl7IqVANbA89/FQ1W75Gvkr93TyVS0BcYs75EUK1MHDCFlsBaY0PhPyK0LSYO6VVrOBEEYLvFkWRED2KtWAbmf1U1avdGJB3HfzXP2+2l5OOG/fy4LvCNkuSaiHa9onILNqVScSU5UapUUiOUmxJJJkwoQTpoRNCDQUbAnATgLDUhAKVqBqIJWMjUsVeIPQrdojAFcxZiNTC3rJXaBF8eoUuUtws1mUzgrFJxGWBGR3EZHoYKo0rQP5h5qxStDSYkEnjCmZdGmdrTtl9tJwEh7oeMDEteHAydHD0V6naGk3Zhx0cC0nkD4uYlYHZ2sDepO0h7d2ODo4eH/AHFalhsNwOYXF9M+FjhIaN2M+WWGS6ppkc4tOjQSUbYaIGQ3knjmdFk27bzG4M75yBHhn+783ScjJCZKxDRtlcMY55/K0u8gSvOttWE1BTpg4zUcT/UGkz1eRPMrYtVpq1XgOxaO8Ywa2MobqZxkzEZ4hPcGeoBA5GJ9gmT4hV6MXslZwacEGXPcXGYgN7sEdD5rqw0HHTIDcBkqeyKIb8TCJcfW64+ZcSr78l5+Z3kZ7fjpLFFL0U3sg54KjXdiZyV6vCy7UZkhNATKyhasyoHuaASVJUzWFtm2fkH2FXjjZ5uWdbKW07ZfMDwhUCUTkBVsVR50nbtgkoFIWobqY5gpJJLTCSEQak0KdjErdDJEYpp/hq02midTSch6Kt1CBOSl+GTyUjWosKFRpBaez4BEjI48lnsMK1QdLsdVzns7QdM6OjSYSGgXjnA+e5T/APpTcbwA4NxPVV6Fta1gAgEZwMeu7qrOxrS2vW+Fea2QTi6XOiO6BEXsSczkc1N8c3suWaC02Hsq0vZcIcGlpeJIkQYkOywwGoyW1Ze0b3NP4bQQXCbzowMBwbGIIgjHIrVsOyqVPFrBP8zu86eBOXSFBSsTKl8OzvvcHDP/ADHsPOLokcQmiqRyyT5NGTaLRUqYPJduaB3ejBn1kq1R2WGNdWrmIaTdB8I3Fw1OEx5rUsmzAxwIxgZnMuOHQAaa3uAT2ofEqspx3WxUqbpH+Ww8zjG4JrEH2XYrlMSO87F3AnJvQYee9Zm1bD8M3m+E6fyndyXR03ggEGQcQd6o7apF1GoBndJHMYj2SmpnKMeA8gktkB14YifCQ4bsG48Ve/iMO9HMGQeKrmzm6yrEtc0FrhiAHQYO7IeSqVqgYC4EADE3jDep/Lz90k8Sk7XZVh8lwVS6LtWp1ncqLhrP3uWbY9tUqjiAfhPmIJBY/k7I+iuOqETebzIxHUZhL8bj2O80Z7Tszdp1bjSeC5Oq+SSVtdorUHODWmQMTxKwyrMUaR5ueVy0AUCkKAruiVjIXIkLlooCScJlphYphXaLVUphXrOVymzrFFqlSVunsxxxI6LT2Hs4uIMSTELuqXZxnwTONSCWgGMsD0ELzc3k8XRZHEqtnldpssKi9i6fatGHFuoJB0AjeVi1XtbkQ52m4ceJVuBSkrZPlcYukU2UnYQ0meBjzyU8tbn3nbgcBzdr0QPtD3YFxjy9lXdQ1vOCpUEidzbJ6lVxzy3DADomafryIyIUbWH+aeY+iMA7/T9U4p1mxu2tWmA2sPitH5pioOZyf1g8V0tk7TWR5aW1W0yC4kVAWYPkuEnCS66cDovL0g5cpYYs7RyyX+nrVq7SWdrC5tak46AVGmTprksp23KIszvx2OqVMXC8L3fcAQQMoYYjgvNnVHTDRzJy/VHjvHr9UqwL2b/0P0en2btbZWU2A1MQ0AgMqHIRo2NFVtXbygPBTqO4m60eZJPovOpP2f0SIK1YImfPI6C19sqzWkUmU6TZJEzUIvGSBMDMk5a8Fylqtb6hl7i48TgOTch0U76M5k+wQ/wzd3qV0UEujnKcn2yoStLZ+26lOGu77NxOI5HdwPoqr7O0cOv1VZ4jUHkhxTVMIzcXaJ61e+4nKTkoyokV5Lwrob5L7EUJSJTIoLEUJRSmctFGASTBJAFtm4K/YaSmoWCBJy9+alLIUsp3pFMYVtnX9mNoNpOBMaZ6RiFf7RdpwARSLgD4jPeJI8LTphqOmOXDUrXGWai2hXMhs+EY8XHElccPiqU+ch8ufVIG22svOOWgGQVMlNWeYwzOA+qKmyBnPNekkQtiAP3iiSTrTBiEN3ifRGkgARKdR1KUmZcOR+SAUeJPMmPJAEnXyT3TvRNEJIAG7xPp9ErvNGkg0EBOnTEIMBKjdSadB5JVA4ZEHg4fMIqTicxHqDyKDSCrTaM24bxoon0hEtxCvkKpVoEYt6hBhWhBkjvJELKBMApkk8JRxkkV1JFhR6ey00G2X4bgDeEyPE54zmMhPnguQtT1WFoMDkoqlVR48PFlUp2ieynvzo0Fx6frCiLpMnXEp7BWEvafzMMcwDh6+iEK2KpEs3sio1DeLXZ5jkrMqvV8TTxjzBU4TCjhOmTrQEkkmWA2Oo2GSeEDrn8wlUeB+xPshpOzzxM4gjcN3BBhMkkkgBJJJLTRJJJLDBIbu7D73J0LnoAJMQq7bTJhonjkFPeQBWtFHUZ68VWWg5ZwWAMVNRpyVEVKypBSTOkDWtmxnU6TKjgIeTEHERvGidUbTtGo8AOcSBkDgBpgAnXBRnW2driQl6Bz1BeSXdI5WXLAAX8bri07nASCfVSPmMInig2e3B7uAaP9Rx9B6qVOuhH2Uahc0iTOIPqr7XKjaj3jyH36q0CYkbh1Wik6SiZWByPQ4HySdUAzICAJZQkqubSOHr9EJtP3H6oAJz3/ANPmfdFSe7UYcDP6+6iFp4IhaW8UAWmulEoG1QciFIHIANJBeSvIANMhvIHvAElABPcqNare5e6VaqXcvvNNSbJhYAIJGIU9O07x5fRF/DDigfZjoZQBKa7YzVQJk6AGcgBRkKMrGagpToU6yhxwUxKSS0C/Yj+Ef/s/6/upFs9h9iMtTa7XlwLfhFrmnIn4ky04GYHyIV61dhrS0911N40MlpPNrhA/3FL8kU6Zvxye0jiq/iKs2c90eSs2vYNpa8tNLGTk5h/7KuLM+mSHtLTnBjLfhy9EyafQji12hq1AHHIqA2Y8FeASuphTMc0jMZqVlnJzwVo08b3CESwKKb7MRiMUmUHHgrb8jyKdAFJ1nI0nkow8jU+a0VDXog46+/NAFcVnb/ZL4zt/oEfwy2HDEa7wNeandSB08loFU1XbyhPEk80VVt0wo5WAEFJZ/F5qNKdUAaITlqjpPkSpVppUtNKcRmq4K0XBUHsgndmsAZMyiXkNaJJmBvgE+wKt0tnVnRFJ8HIlpAI4OMD1XRbB2A6m74lQiQO60YxOZJ3xhhvSSmkh4Y3JnHApLU7RWH4VYx4X95vXxDz9wktTvYNU6MxOCmSBWgehf4VHvWjlR96q9FcF5t/hW/v1x/TS9C/6r0gnBRZf0V4/yjj9ps/9w4cHHzuFcj2jb+KP7G/8nLtdvU4rtOjmnzEfJq5HtOzFjuDh7Ee5XTE9oXMvqzDptj79lIgCeVWR0DUG4wd6q3Km/wBVaKSwCvNQZwU7nVImByzKmKdaYVW1n7vRWKc6x0RJBBo6AuAGOiNA9gOf6c0AU3AmXHDcowpa75y8M+aiWGDgpFJBUdggCaw1Deu4m8YAAkycAABvWt/BVdadQc2PHuFzzV7H2J28LVRF4/ishtQb9z+R95SZJuKtI644KTps4Gls2s4w2lVJ4U3+8YLYodjawAq1QBGTAQXA6OfGEA6AnjqvTWhOWhTvPJlEcMV3syNn0G1bOyRgW4bxnBCy7TZzTddPQ7xvC6HZNG5TufyuqAcviPu+kIdp2S+2PzDFp47uRXK6Z2TOC7Q7M+M1oyIdIPAjEe3kktSoE66qbSoSWNN20eXJJFIBVEZ2/wDhhTf8ao8DuXA1x/qJvNjf4T/uC9NBXA9gKl2iwNzdXqX+TWN+RaV3Qco8u5FeNfVGV2ipTTDhm0iOuBHXBcdt1l+iSBi0h0aiMHA9CV3G18aTuU+RB+S5GpRwMRBwIM5ZYcOHrCMbo2atHGNKKUnsgkbiR5GPkkriAjDpk8YHTP5qF1qM5BWQFDUpAnLrkgwFtonPBELS3j5KCrZyMsQlTs5OeCALItDd6kz91VFnE4n5K0wACAsAdC9s5olXtNSBhqtAhtFScBoomp4SQA8qa02a5TBPiLh0EZJrE2XgnJuPXT74Kfar5YOaRvdHSMfq2ZYV7ZO0qlnqtq0jDhvycDm1w1B+ioBEFrQqez27s52ipWpl5hhw8bCe8w/Nu4/PBbV9eA2Su9jmuplzXg90tJDp4R7L0jYO3bT8M/xDA535YhjiIGLtN+7JSZMVbRXjycuzr7NV7zm7jPmT9Cp3lcxsi3VDWJc3/MugiR3bt44AYR3nEmV0Tnrm0dUcvtVwbUfz04gFJQbcJNR90Sbw1jIQknXQNs8xRAISU4KrIT0P/Dal+HUccr4A4G6LxHMFnku3lcz2Ho3LJT/qvP8ANxj/APIauilRzf2ZZBVFGX2grm62mM6jwOgxPssR5wWvaAX2puGFOneJ3OcXNbhyB8ll7QEVHDjPnj80I04e0nvv/vf/AMihBSrHvO/uPugZuVx577CduTgICUi8b1pg78k4QFyKUAOQmDtEpTEoAe8qlqOI6qfADcFTc6TP3CAEmSTtEkDigC7ZWw3nj9FFb/D1VgAz4T5hV9oE3RhGK4r9FD1EoBS0aRcQ1okkwBvKjC6nsPso1XuqaNwB3T4jziB1KeUqVnKEbdGrsDYgZ4ReqEd527gJyHuukOy7rHOc7ENJgZYCdc1p2WztYLrRA9+JKi2tUik6MS6GgDMlxiAonJtlySSor7Bo5vP9o5a/LyWu92Cr2OlcY1u4Yxv19ZVfa1pu0zvOA6/pKz+mmBaK0ku3knzMpLK2hbRTF8nCbo9ST6R04pl1UGI5pHFlErDLMDqfRTfwTYzPp9FTZLR6vsuiKdJjB+VjW+QAV0uVajkFI4qJ9lhXoj8SqTvY0cgxrseryuc7RWkMc924NjmQAF0LH41P7x/46a4nta8l3+v2aQF0hG5CzlUTnkFR0Y6a/VEmKrIByZVd9AftCeznEjQfVTLQIqdGNeiete0y9VKkgCqxjt5H36qyE6gtDtEAR16k4DL3UYTgJIASks/iCjQlDBGsCq20fCBxRtdhPBRWzILiuyhu0UmtK9i7ObOFCgynAkCX8XnF3rhyAXm3ZWi11qpgiQCXRxaC4T1AXqNOueCTK70bhSWy8XgKFveIcch4Ac8RF47jBIA0BO+BXo1S5z5yaQ0DTFrXEkanH0VsOXCqKLsJz1zu17TefAybh/q1+nmta3VCGEjOFzjmIQM5ftLVBc2mMmiY54D0HqmUFrs4c9ziTJJ3chpuCSrSpEktuz//2Q==",
    createdAt: "2024-01-05T10:15:30Z",
    updatedAt: "2024-01-05T10:15:30Z",
    invoiceDetails: [
      {
        id: 2,
        feeTypeId: 1,
        feeTypeName: "Tiền điện",
        amount: "200.00",
        unitPrice: null,
        totalPrice: "400300.00",
        calculationBreakdown: {
          "Bậc 1": "50*1806",
          "Bậc 2": "50*1866",
          "Bậc 3": "100*2167",
        },
      },
      {
        id: 1,
        feeTypeId: 2,
        feeTypeName: "Tiền nước",
        amount: "100.00",
        unitPrice: null,
        totalPrice: "1331970.00",
        calculationBreakdown: {
          "Bậc 1": "10*5973",
          "Bậc 2": "10*7052",
          "Bậc 3": "10*8669",
          "Bậc 4": "70*15929",
        },
      },
      {
        id: 3,
        feeTypeId: 3,
        feeTypeName: "Phí quản lý",
        amount: "100.00",
        unitPrice: "12000.00",
        totalPrice: "1200000.00",
        calculationBreakdown: null,
      },
      {
        id: 4,
        feeTypeId: 4,
        feeTypeName: "Phí giữ xe máy",
        amount: "1.00",
        unitPrice: "100000.00",
        totalPrice: "100000.00",
        calculationBreakdown: null,
      },
      {
        id: 5,
        feeTypeId: 5,
        feeTypeName: "Phí giữ xe ô tô",
        amount: "1.00",
        unitPrice: "1200000.00",
        totalPrice: "1200000.00",
        calculationBreakdown: null,
      },
      {
        id: 6,
        feeTypeId: 6,
        feeTypeName: "Phí xe đạp",
        amount: "1.00",
        unitPrice: "20000.00",
        totalPrice: "20000.00",
        calculationBreakdown: null,
      },
    ],
  },
];
export const getInvoicesMadeByClient = async () => {
  const response = await axiosInstance.get("/invoices/made-by-client/list");
  return response.data.data as InvoiceDetail[];
};
