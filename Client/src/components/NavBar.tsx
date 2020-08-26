import React from "react";
import { Flex, Link, Box, Button } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { link } from "fs";
import { isServer } from "../utils/isServer";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  console.log(data?.me);
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={4}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={4}>{data.me?.username}</Box>
        <Button
          color="black"
          variant="link"
          onClick={() => logout()}
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" padding={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  );
};
