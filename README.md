# photo-finder
A platform for users to discover photographers based on style, category, and location.


## Flickr API Integration
We are using the **Flickr API** as our primary data source for fetching photos. This allows users to browse images uploaded by photographers.

### API Documentation
Flickr API Docs: [https://www.flickr.com/services/api/](https://www.flickr.com/services/api/)

### API Endpoints Being Used
- Search Photos: [`flickr.photos.search`](https://www.flickr.com/services/api/flickr.photos.search.html)  
  - Retrieves photos based on search terms.

- Get Photo Info: [`flickr.photos.getInfo`](https://www.flickr.com/services/api/flickr.photos.getInfo.html)  
  - Retrieves details about a specific photo, including the photographer’s username.

- Get User Info: [`flickr.people.getInfo`](https://www.flickr.com/services/api/flickr.people.getInfo.html)  
  - Gets details about a photographer.
