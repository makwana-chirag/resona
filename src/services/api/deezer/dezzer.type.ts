// Artist related types
export interface DeezerArtist {
  id: number;
  name: string;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  nb_album: number;
  nb_fan: number;
  radio: boolean;
  tracklist: string;
  type: 'artist';
}

// Album related types
export interface DeezerAlbum {
  id: number;
  title: string;
  link: string;
  cover: string;
  cover_small: string;
  cover_medium: string;
  cover_big: string;
  cover_xl: string;
  release_date: string;
  tracklist: string;
  type: 'album';
  artist: DeezerArtist;
  nb_tracks: number;
  duration?: number;
  fans?: number;
  rating?: number;
}

// Track/Song related types
export interface DeezerTrack {
  id: number;
  readable: boolean;
  title: string;
  title_short: string;
  title_version: string;
  link: string;
  duration: number;
  rank: number;
  explicit_lyrics: boolean;
  explicit_content_lyrics: number;
  explicit_content_cover: number;
  preview: string;
  md5_image: string;
  position: number;
  artist: DeezerArtist;
  album: DeezerAlbum;
  type: 'track';
}

// Search response wrapper
export interface DeezerSearchResponse<T> {
  data: T[];
  total: number;
  next: string | null;
  prev: string | null;
}

// Search parameters
export interface SearchParams {
  q: string;
  limit?: number;
  index?: number;
}

// Artist top tracks response
export interface ArtistTopTracksResponse {
  data: DeezerTrack[];
  total: number;
}

// Album tracks response
export interface AlbumTracksResponse {
  data: DeezerTrack[];
  total: number;
}

// Genre types
export interface DeezerGenre {
  id: number;
  name: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  type: 'genre';
}

// Radio types
export interface DeezerRadio {
  id: number;
  title: string;
  description: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  tracklist: string;
  type: 'radio';
}

// Playlist types
export interface DeezerPlaylist {
  id: number;
  title: string;
  description: string;
  duration: number;
  public: boolean;
  is_loved_track: boolean;
  collaborative: boolean;
  nb_tracks: number;
  fans: number;
  link: string;
  share: string;
  picture: string;
  picture_small: string;
  picture_medium: string;
  picture_big: string;
  picture_xl: string;
  checksum: string;
  tracklist: string;
  creation_date: string;
  creator: DeezerCreator;
  type: 'playlist';
}

export interface DeezerCreator {
  id: number;
  name: string;
  tracklist: string;
  type: 'user';
}