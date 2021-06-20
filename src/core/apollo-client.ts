import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { AUTH_TOKEN } from "./index";

const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
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
    uri: "http://localhost:4000",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

