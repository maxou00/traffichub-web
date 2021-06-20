import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "./index";
import { isDev } from "./utils";

const httpLink = createHttpLink({
    uri: isDev() ? 'http://localhost:4000' : "https://api.traffichub.co",
    credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
    const token = window ? localStorage.getItem(AUTH_TOKEN) : "";
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})

export const apolloClient = new ApolloClient({
    uri: isDev() ? "http://localhost:4000" : "https://api.traffichub.co",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

