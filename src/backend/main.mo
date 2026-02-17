import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import Migration "migration";

// Enable data migration on upgrades.
(with migration = Migration.run)
actor {
  // Include authorization and storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Movie = {
    title : Text;
    description : Text;
    posterImageUrl : Text;
    videoBlob : ?Storage.ExternalBlob;
  };

  public type UserProfile = {
    name : Text;
  };

  let movies = Map.empty<Text, Movie>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // New field: persists across upgrades, defaults to false if missing in previous versions
  var adminClaimed : Bool = false;

  // Admin bootstrapping: first authenticated principal becomes permanent admin
  public shared ({ caller }) func claimAdmin() : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Anonymous principal cannot claim admin role");
    };

    if (adminClaimed) {
      Runtime.trap("Admin role has already been claimed");
    };

    // Assign the admin role to this caller
    AccessControl.assignRole(accessControlState, caller, caller, #admin);
    adminClaimed := true;
  };

  // Movie management functions (admin-only)
  public shared ({ caller }) func addMovie(id : Text, movie : Movie) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    movies.add(id, movie);
  };

  public shared ({ caller }) func updateMovie(id : Text, movie : Movie) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie with given ID does not exist") };
      case (?_) { movies.add(id, movie) };
    };
  };

  public shared ({ caller }) func deleteMovie(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie with given ID does not exist") };
      case (?_) { movies.remove(id) };
    };
  };

  public shared ({ caller }) func uploadMovieVideo(id : Text, video : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (movies.get(id)) {
      case (null) { Runtime.trap("Movie with given ID does not exist") };
      case (?movie) {
        movies.add(id, { movie with videoBlob = ?video });
      };
    };
  };

  // Public movie browsing (no authorization required - guests allowed)
  public query func getMovie(id : Text) : async ?Movie {
    movies.get(id);
  };

  public query func getAllMovies() : async [(Text, Movie)] {
    movies.toArray();
  };

  // User profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};

