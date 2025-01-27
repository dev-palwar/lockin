import { Document, Types } from "mongoose";

export interface ITask {
  title: string;
  status: boolean;
}

export interface IDay {
  date: Date;
  name: string;
  dp?: string;
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
  name: string;
  dp?: string;
  arcs: Types.ObjectId[] | IArc[];
}

export interface ITaskDocument extends ITask, Document {}
export interface IDayDocument extends IDay, Document {}
export interface IArcDocument extends IArc, Document {}
export interface IUserDocument extends IUser, Document {}
