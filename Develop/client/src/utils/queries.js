import { gql } from '@apollo/client';

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      books {
        _id
        title
        createdAt
      }
    }
  }
`;

export const QUERY_BOOKS = gql`
  query getBooks {
    books {
      _id
      title
      authors
      createdAt
    }
  }
`;

export const QUERY_SINGLE_BOOK = gql`
  query getSingleBook($bookId: ID!) {
    book(bookId: $bookId) {
      _id
      title
      authors
      createdAt
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      books {
        _id
        title
        authors
        createdAt
      }
    }
  }
`;
