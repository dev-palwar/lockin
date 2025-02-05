import { Document, Types } from "mongoose";

export type Task = {
  title: string;
  status: boolean;
};

export type Day = {
  date: string;
  name: string;
  image?: string;
  tasks: Task[];
  successRate: number;
};

export interface SessionUser {
  name: string;
  email: string;
  image: string;
  id: string;
}

export interface ITask {
  title: string;
  status: boolean;
}

export interface IDay {
  date: Date;
  name: string;
  image?: string;
  tasks: ITask[];
  successRate: number;
}

export interface IArc {
  name: string;
  dpOfArc?: string;
  totalDays: number;
  days: IDay[];
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  arcs: Types.ObjectId[] | IArc[];
}

export interface ITaskDocument extends ITask, Document {}
export interface IDayDocument extends IDay, Document {}
export interface IArcDocument extends IArc, Document {}
