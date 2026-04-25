import { prisma } from "util/db";
import { hashPassword } from "util/hash";
import { UserRole } from "@prisma/client";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

function toUserDto(user: UserRecord) {
  return {
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
  };
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} as const;

export default class UsersService {
  static async find(id?: string, q?: string, role?: string) {
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return user ? toUserDto(user) : null;
    }

    const users = await prisma.user.findMany({
      where: {
        OR: q
          ? [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }]
          : undefined,
        role: role as UserRole | undefined,
      },
      select: userSelect,
    });

    return users.map(toUserDto);
  }

  static async create(data: { username: string; email: string; password: string; role: UserRole }) {
    const check_for_email = await prisma.user.findUnique({ where: { email: data.email } });
    if (check_for_email) {
      throw new Error("Email is already in use");
    }

    const user = await prisma.user.create({
      data: {
        name: data.username,
        email: data.email,
        password: await hashPassword(data.password),
        role: data.role,
      },
      select: userSelect,
    });

    return toUserDto(user);
  }

  static async update(
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    }
  ) {
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error("Email is already in use");
      }
    }

    const updateData: {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
    } = {};

    if (data.username) {
      updateData.name = data.username;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await hashPassword(data.password);
    }

    if (data.role) {
      updateData.role = data.role;
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });

    return toUserDto(user);
  }

  static async delete(id: string) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}
