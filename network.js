const getReq = (url, success, err) => {
  const request = new XMLHttpRequest();

  request.onreadystatechange = () => {
    //   console.log(request, request.readyState);
    if (request.readyState === 4 && request.status === 200) {
      //   console.log(request.responseText);
      console.log(request);
      success(JSON.parse(request.responseText));
    } else {
      //   console.error('Could not process request');
      err('Could not process request');
    }
  };

  request.open('GET', url);
  request.send();
};

// getReq(
//   './timeTable.json',
//   (res) => {
//     console.log(res);
//   },
//   (res) => {
//     console.error(res);
//   }
// );
