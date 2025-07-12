type ISODateString = string;

export interface CleanSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
  };
  expires: ISODateString;
}
