import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
    mutation SignupMutation(
        $firstName: String!
        $lastName: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        signup(
            firstName: $firstName
            lastName: $lastName
            email: $email
            password: $password
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

export const CREATE_PROJECT_MUTATION = gql`
    mutation CreateProjectMutation(
        $projectTitle: String!
        $projectComment: String!
        $firstTrackerTitle: String!
        $firstTrackerUrl: String!
    ) {
        createProject(
            project: {
                title: $projectTitle,
                comment: $projectComment
            },
            firstTracker: {
                title: $firstTrackerTitle,
                url: $firstTrackerUrl
            }
        ) {
            id
        }
    }
`;

