exports.getCookie = (req, res, next) => {
  const axios = require("axios");

  const lab_assistant=
  "x-amcs-auth=U2FsdGVkX19IqvOqPpb9LOe%2BY%2B%2FOb06xVx4nzkxcB3QoN80bWovwwbZmSpMpxRZaEkbGKPttYcJrr7cqAz1RFtd1QJfEJQfEa0ok1e8i1TKYUIJbEr%2BLuxNo56oR0q9Bw06tg9lchipt%2Fj9Br6oLcS0k2t5e8iWCoPhvQGf0SIp3E506qPVGsXlPbU4KZFLHveiFvP%2B3CCDwwpSbdVEC5Q%2BKtEQsAgPv39iWWHyu1B6dZM7fO6eaya20I%2BHnqxxVfbF2QNj2sPJrd1%2Fg9GQATn2eBIxetPF7r2Q6Rv1KEa3XNau%2BEDwvuDpDmyTV0bNZL5xA4g%2FR2ZC79Dul1jzT%2Bt%2BI7l5C1AzJUUWs6Ls2WqE9bimKqWbOny1NK2wElpdJkC8v%2BYffJsD9DXFPJcFA1R8q%2FUou6J4x2klUsLhpv6A5rA%2BFvEx34Vgm22%2FRfa7FwpEr68FoLzgmkNtQsvWMJc76jL8YKnMuGweD1EmSCK8frr176DQR5qJsylba1yemfACsZEIdzS4wSiqnip48cC55KM18qzSBogX75tLNEfm71DlwQ7iwMgnKO2w6LSxIRR%2FATnsMrJz%2BuHrBUfv5LGY6m8gV7k%2BpnN0EHNSCCvUYUf7xqDWEnC4Zho9KUgKm; x-amcs-refresh=U2FsdGVkX187LwPNh%2FP%2BJ6wlySu%2Bowah4Xtn1SwlFyJSXJY%2Fyg8IpFF7MfHqTgbY%2FWVz4%2FqWGSdIiS9ab5hvL71V%2BcqTL0qU85C1ygcozlDxT8bBtTuBClEW1HIxYiTObbzy0kGuyDYR5JkJdjgIfjYL5FI8LmJcgiRXUoNvv5beDkd6XrGA2Wj1Hl0vHUAvdHMS4YROfyt8k54XGmwqjeATIyzpKxvev%2BSj1bi762kvnwkJvXBlHUIBThdt6Lhe"
  const config = {
    method: "get",
    url: "https://nucleus.amcspsgtech.in/server",
    headers: {
      path: "/profile",
      cookie: lab_assistant,
    },
  };

  axios(config)
    .then(function (response) {
      if (response.request._redirectable._isRedirect) {
        res.redirect(response.request._redirectable._currentUrl);
      } else {
        res.locals.userDetails = {
          id: response.data.data.id,
          firstName: response.data.data.firstName,
          lastName: response.data.data.lastName,
          email: response.data.data.email,
          mobileNo: response.data.data.mobileNo,
        }

        if (response.data.data.id === "admin") {
          res.locals.role = "admin";
        } else {
          res.locals.role = response.data.data.roles[0];
          if (
            response.data.data.roles[1] &&
            response.data.data.roles[1] == "pr"
          )
            res.locals.isPR = true;
          else res.locals.isPR = false;
        }
        next();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
};
