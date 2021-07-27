# learn-graphql

* Query language for API - 정의된 데이터 타입을 사용하여 서버 사이드 런타임에서 쿼리를 실행
* Database agnostic

GraphQL 서비스는 데이터의 타입과 필드, 그리고 필드에 접근 할 수 있는 함수로 이루어져있다.

&nbsp;  

## 1. Fields

*  the query has exactly the same shape as the result. you always get back what you expect, and the server knows exactly what fields the client is asking for.
* the query is interactive - you can change it as you like and see the new result.
* fields can also refer to Objects. In that case, you can make a *sub-selection* of fields for that object.
* GraphQL queries can traverse related objects and their fields, letting clients fetch lots of related data in one request, instead of making several roundtrips as one would need in a classic REST architecture.

```
// gql
{
  hero {
    name
    # Queries can have comments!
    friends {
      name
    }
  }
}

// data
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "friends": [
        {
          "name": "Luke Skywalker"
        },
        {
          "name": "Han Solo"
        },
        {
          "name": "Leia Organa"
        }
      ]
    }
  }
}
```



&nbsp;  

## 2. Arguments

* in GraphQL, every field and nested object can get its own set of arguments, making GraphQL a complete replacement for making multiple API fetches
* You can even pass arguments into **scalar fields**, to implement data transformations once on the server
* GraphQL server can also declare its own custom types, as long as they can be serialized into your transport format.

```
// gql
{
  human(id: "1000") {
    name
    height(unit: FOOT)
  }
}

// data
{
  "data": {
    "human": {
      "name": "Luke Skywalker",
      "height": 5.6430448
    }
  }
}
```

&nbsp;  

## 3. Aliases

* the result object fields match the name of the field in the query but don't include arguments, you can't directly query for the same field with different arguments. - use aliases

```
// gql
{
  empireHero: hero(episode: EMPIRE) {
    name
  }
  jediHero: hero(episode: JEDI) {
    name
  }
}

// data
{
  "data": {
    "empireHero": {
      "name": "Luke Skywalker"
    },
    "jediHero": {
      "name": "R2-D2"
    }
  }
}
```

&nbsp;  

## 4. Fragments

* GraphQL includes reusable units called *fragments*. Fragments let you construct sets of fields, and then include them in queries where you need to.
* The concept of fragments is frequently used **to split complicated application data requirements into smaller chunks**, especially when you need to combine lots of UI components with different fragments into one initial data fetch.

```
// gql using alias + argument(Enum) + fragment
{
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

// fragment
fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}
```

&nbsp;  

### Using variables in fragments

* It is possible for fragments to access variables declared in the query or mutation.

```
// $first: Int = 3
query HeroComparison($first: Int = 3) {
  leftComparison: hero(episode: EMPIRE) {
    ...comparisonFields
  }
  rightComparison: hero(episode: JEDI) {
    ...comparisonFields
  }
}

fragment comparisonFields on Character {
  name
  # using variables declared in the query
  friendsConnection(first: $first) {
    totalCount
    edges {
      node {
        name
      }
    }
  }
}
```

&nbsp;  

## 5. Operation

* Operation = Operation Type(`query`, `mutation`, `subscription`) + Operation Name
* Operation Type =  describes what type of operation you're intending to do.
* Operation Name = a meaningful and explicit name for your operation (helpful for debugging and server-side logging)
* use these to make our code less ambiguous.
* The operation type is required **unless you're using the query shorthand syntax**, in which case you can't supply a name or variable definitions for your operation.

```
query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}
```

&nbsp;  

## 6. Variables

* in most applications, the arguments to fields will be dynamic
* a way to factor dynamic values out of the query, and pass them as a separate dictionary. These values are called ***variables***.
* a good practice for denoting which arguments in our query are expected to be dynamic

```
// gql without variable
query HeroNameAndFriends {
	# EMPIRE enum 값을 static하게 사용
  hero(episode: EMPIRE) {
    name
    friends {
      name
    }
  }
}

// gql with variable

// 2. $variableName 선언 (with Type info)
query HeroNameAndFriends($episode: Episode) {
	
	# 1. replace the static value with $variableName
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}

// 3. Pass `variableName: value` in variables dictionary (usally JSON)
{
	"episode", "JEDI"
}
```

&nbsp;  

### Variable definitions

* It lists all of the variables, prefixed by `$`, followed by their type, in this case `Episode`.  `($episode: Episode)`
* declared variables must be either scalars, enums, or input object types.
* Variable definitions can be optional or required (`!` = required)
* Default values can also be assigned to the variables in the query by adding the default value after the type declaration.

```
// using default variable
query HeroNameAndFriends($episode: Episode = JEDI) {
  hero(episode: $episode) {
    name
    friends {
      name
    }
  }
}
```

&nbsp;  

## 7. Directives

* a way to dynamically change the structure and shape of queries using variables.
* A directive can be attached to a field or fragment inclusion, and can affect execution of the query in any way the server desires.
* `@include(if: Boolean)` Only include this field in the result if the argument is `true`
* `@skip(if: Boolean)` Skip this field if the argument is `true`.

```
// gql with directives
query Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    # 만약 $withFriends의 값이 true이면 friends 필드를 추가
    friends @include(if: $withFriends) {
      name
    }
  }
}

// variables
{
  "episode": "JEDI",
  "withFriends": false
}

// data
{
  "data": {
    "hero": {
      "name": "R2-D2"
    }
  }
}
```

&nbsp;  

## 8. Mutation

* any operations that cause writes
* if the mutation field returns an object type, you can ask for nested fields. This can be useful for fetching the new state of an object after an update.

```
// gql - mutation
// mutate and query the new value of the field with one request.
// $review: ReviewInput -> input object type

mutation CreateReviewForEpisode($ep: Episode!, $review: ReviewInput!) {
  createReview(episode: $ep, review: $review) {
    stars
    commentary
  }
}

// variables
{
  "ep": "JEDI",
  "review": {
    "stars": 5,
    "commentary": "This is a great movie!"
  }
}

// data - returned by mutation
{
  "data": {
    "createReview": {
      "stars": 5,
      "commentary": "This is a great movie!"
    }
  }
}
```

&nbsp;  

### Multiple Fields in mutations

* A mutation can contain multiple fields, just like a query.
* multiple fields in query vs. mutation
  * multiple fields in query: **query fields are executed in parallel**
  * multiple fields in mutation: **mutation fields run in series, one after the other.**

&nbsp;  

## 9. Inline Fragments

*  GraphQL schemas include the ability to define interfaces and union types.
* If you are **querying a field that returns an interface or a union type**, you will **need to use *inline fragments* to access data on the underlying concrete type.**
* To ask for a field on the concrete type, you need to use an *inline fragment* with a type condition.
* Named fragments can also be used in the same way, since a named fragment always has a type attached.

```
// gql
query HeroForEpisodes($ep: Episode!) {
	# hero field returns union type (Human | Droid)
	hero(episode: $ep) {
		name
		... on Droid {
			primaryFunction
		}
		... on Human {
			height
		}
	}
}

// variables
{
  "ep": "JEDI"
}

// data
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "primaryFunction": "Astromech"
    }
  }
}
```

&nbsp;  

### Meta fields

* GraphQL allows you to request `__typename`, a meta field, at any point in a query **to get the name of the object type** at that point.

```
// gql
{
	# search field returns an union type (Human | Droid | starship)
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}

// data
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
```

