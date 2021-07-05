import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $firstName: String!
        $lastName: String!
        $gender: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        signin(
            firstName: $firstName,
            lastName: $lastName
            gender: $gender,
            email: $email,
            password: $password,
            confirmPassword: $confirmPassword
        ) {
            token
            profile { 
                id
                firstName
                lastName
                email
                createdAt
                updatedAt
            }
        }
    }
`;

export const SIGNIN_MUTATION = gql`
    mutation SigninMutation(
        $email: String!
        $password: String!
    ) {
        signin(
            email: $email,
            password: $password
        ) {
            token
            profile { 
                id
                firstName
                lastName
                email
                createdAt
                updatedAt
            }
        }
    }
`;


export const CREATE_TRACKER_MUTATION = gql`
    mutation CreateProjectMutation (
        $title: String!
        $url: String!
    ) {
        createTracker(
            tracker: {
                title: $title,
                url: $url
            }
        ) {
            id
        }
    }
`;

