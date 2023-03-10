import BookPreview from "../../components/bookPreview";
import { useState, useRef, useEffect } from 'react'
import styles from './style.module.css'

export default function Search() {
  // stores search results
  const [bookSearchResults, setBookSearchResults] = useState()
  // stores value of input field
  const [query, setQuery] = useState("")
  // compare to query to prevent repeat API calls
  const [previousQuery, setPreviousQuery] = useState()
  // used to prevent rage clicks on form submits
  const [fetching, setFetching] = useState(false)

  // TODO: Write a submit handler for the form that fetches data from:
  // https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=YOUR_QUERY
  // and stores the "items" property in the result to the bookSearchResults variable
  // This function MUST prevent repeat searches if:
  // fetch has not finished
  // the query is unchanged

  async function getItems(e) {
    e.preventDefault()
    setFetching(true)
    const result = await fetch(`https://www.googleapis.com/books/v1/volumes?langRestrict=en&maxResults=16&q=${query}`)
    const results = await result.json()
    setBookSearchResults(results)
    setFetching(false)
  }
  
  


  const inputRef = useRef()
  const inputDivRef = useRef()

  
  console.log('query', query)
  console.log('bookSearchResults', bookSearchResults)
  console.log('previousQuery', previousQuery)
  console.log('fetching', fetching)

  /**
   *   × should not call Books API again if query is unchanged
     × should not call Books API again until previous request is done
     × should NOT call Books API when search field is blank
   * 
   */
  return (
    <main className={styles.search}>
      <h1>Book Search</h1>
      {/* TODO: add an onSubmit handler */}
      <form className={styles.form} onSubmit={getItems}>
        <label htmlFor="book-search">Search by author, title, and/or keywords:</label>
        <div ref={inputDivRef}>
          {/* TODO: add value and onChange props to the input element based on query/setQuery */
        }
          <input
            ref={inputRef}
            type="text"
            name="book-search"
            id="book-search"
            value={query} 
            onChange={e => {
              console.log('e ', e);
              setPreviousQuery(query);
              setQuery(e.target.value)}} 
            />
          <button disabled={query == previousQuery || fetching == true || query  == ''} type="submit">Submit</button>
        </div>
      </form>
      {
        // if loading, show the loading component
        // else if there are search results, render those
        // else show the NoResults component
        fetching
        ? <Loading />
        : bookSearchResults?.items?.length > 0
        ? <div className={styles.bookList}>
            {/* TODO: render BookPreview components for each search result here based on bookSearchResults */
            bookSearchResults
            ?.items.map((item) => {
              const {authors, title, previewLink, imageLinks} = item.volumeInfo;
              console.log('item ', item);
              return (<BookPreview title={title} authors={authors} thumbnail={imageLinks.thumbnail} previewLink={previewLink} />);
          })
      }
          </div>
        : <NoResults
          {...{inputRef, inputDivRef, previousQuery}}
          clearSearch={() => setQuery("")}/>
      }
    </main>
  )
}

function Loading() {
  return <span className={styles.loading}>Loading...⌛</span>
}

function NoResults({ inputDivRef, inputRef, previousQuery, clearSearch }) {
  function handleLetsSearchClick() {
    inputRef.current.focus()
    if (previousQuery) clearSearch()
    if (inputDivRef.current.classList.contains(styles.starBounce)) return
    inputDivRef.current.classList.add(styles.starBounce)
    inputDivRef.current.onanimationend = function () {
      inputDivRef.current.classList.remove(styles.starBounce)
    }
  }
  return (
    <div className={styles.noResults}>
      <p><strong>{previousQuery ? `No Books Found for "${previousQuery}"` : "Nothing to see here yet. 👻👀"}</strong></p>
      <button onClick={handleLetsSearchClick}>
        {
          previousQuery
          ? `Search again?`
          : `Let's find a book! 🔍`
        }
      </button>
    </div>
  )
}