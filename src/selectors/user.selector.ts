import { BaseSelector } from "@/lib/core/selector/BaseSelector";
import { Prisma } from "@prisma/client";

export class UserSelector extends BaseSelector<Prisma.UserDelegate> {}
