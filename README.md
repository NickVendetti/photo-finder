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

### API Authentication
To make requests, you will need an **API key** from Flickr:
1. **Sign up** for a Flickr account.
2. **Request an API key** from the [Flickr API Key Page](https://www.flickr.com/services/apps/create/).
3. **Store your API key in an environment variable** in a `.env` file:
   ```env
   VITE_FLICKR_API_KEY=your_api_key_here