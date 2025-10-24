async function fetchGetGithubActivity(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/events`
  );
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found!");
    } else {
      throw new Error(`Error fetching data: ${response.status}`);
    }
  }
  return data;
}

function displayActivity(event) {
  if (event.length === 0) {
    console.log("No recent activity found");
    return;
  }
  event.forEach((event) => {
    let action;
    // console.log(event);
    switch (event.type) {
      case "PushEvent":
        if (event.payload.commmits && event.payload.commits.length > 0) {
          const commitCount = event.payload.commits.length;
          action = `Pushed ${commitCount} commit(s) to ${event.repo.name}`;
        } else {
          action = `Push detected on ${event.repo.name}, but no data found.`;
        }
        break;
      case "IssuesEvent":
        action = `${event.payload.action} a new issue in ${event.repo.name}`;
        break;
      case "CreateEvent":
        action = `Created ${event.payload.ref_type} in ${event.repo.name}`;
        break;
      case "WatchEvent":
        action = `Starred ${event.repo.name}`;
        break;
    }
    console.log(`- ${action}`);
  });
}

const username = process.argv[2];
if (!username) {
  console.error("Please provide a username!");
}

fetchGetGithubActivity(username)
  .then((event) => {
    displayActivity(event);
  })
  .catch((error) => {
    console.log(error.message);
  });
