"use client";

import Link from "next/link";

import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { memo } from "react";

import { User } from "@/types/user.types";

interface UserTableProps {
  users: User[];
}

function UserTable({
  users,
}: UserTableProps) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 4,
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>User</strong>
            </TableCell>

            <TableCell>
              <strong>Email</strong>
            </TableCell>

            <TableCell>
              <strong>Gender</strong>
            </TableCell>

            <TableCell>
              <strong>Phone</strong>
            </TableCell>

            <TableCell>
              <strong>Company</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {users.map((user) => (
            <TableRow
              key={user.id}
              hover
              sx={{
                cursor: "pointer",
              }}
            >
              <TableCell>
                <Link
                  href={`/users/${user.id}`}
                  style={{
                    textDecoration:
                      "none",
                    color: "inherit",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <Avatar
                      src={user.image}
                    />

                    <Typography>
                      {user.firstName}{" "}
                      {user.lastName}
                    </Typography>
                  </div>
                </Link>
              </TableCell>

              <TableCell>
                {user.email}
              </TableCell>

              <TableCell>
                {user.gender}
              </TableCell>

              <TableCell>
                {user.phone}
              </TableCell>

              <TableCell>
                {user.company?.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default memo(UserTable);