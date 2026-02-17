import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  public type OldMovie = {
    title : Text;
    description : Text;
    posterImageUrl : Text;
    videoUrl : Text;
  };

  public type OldActor = {
    movies : Map.Map<Text, OldMovie>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public type NewMovie = {
    title : Text;
    description : Text;
    posterImageUrl : Text;
    videoBlob : ?Storage.ExternalBlob;
  };

  public type NewActor = {
    movies : Map.Map<Text, NewMovie>;
    userProfiles : Map.Map<Principal, { name : Text }>;
  };

  public func run(old : OldActor) : NewActor {
    let newMovies = Map.empty<Text, NewMovie>();
    for ((id, oldMovie) in old.movies.entries()) {
      newMovies.add(
        id,
        {
          title = oldMovie.title;
          description = oldMovie.description;
          posterImageUrl = oldMovie.posterImageUrl;
          videoBlob = null;
        },
      );
    };
    {
      movies = newMovies;
      userProfiles = old.userProfiles;
    };
  };
};

