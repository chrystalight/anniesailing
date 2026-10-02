/* ==========================================================
   FUNDING & FINANCES — EDIT THIS FILE
   ----------------------------------------------------------
   Real figures from Annie's expense sheet (January, February
   and June 2026). Amounts are in CAD.

   Months listed in "estimateMonths" are ESTIMATES (the average of
   the real months). When real figures for a month are ready, add
   the month to "months" and remove it from "estimateMonths".
   "baselineAdjust" lowers a recorded month when working out the
   typical month used for estimates (its real figures are unchanged).
   "shareTarget" sets a category to a share of total spending
   (0.15 = 15%) by scaling its estimated months up or down.
   An estimated month can be adjusted: "zero" sets categories to $0,
   and "exclude" leaves out a one-off item (matched by its name in
   the January/February lists) from that month's average, "scale"
   sets a category to a share of a recorded month (["Feb", 0.5] =
   half of February's), "factor" multiplies the whole month, and
   "zeroAll" sets the month to $0 (except any categories listed
   in "keep", which stay at the typical month).

   - To add a month: add an entry to "months" and an entry to
     "examples" (the detailed list shown with receipts).
   - receipt: put the receipt image/PDF in assets/receipts/ and
     enter its filename (e.g. "air-canada-jan.pdf"). Leave "" if
     none. Black out card numbers / addresses first.
   - budget: add a number per category to show budget bars.
     Leave it as null to hide the budget section.
   ========================================================== */
window.FINANCES = {
  "isSample": false,
  "period": "January–October 2026",
  "categories": [
    "Flights",
    "Accommodation",
    "Coaching fees",
    "Food",
    "Equipment",
    "Registration",
    "Physio/gym",
    "Other"
  ],
  "budget": null,
  "baselineAdjust": [
    {
      "month": "Feb",
      "subtract": 3000
    }
  ],
  "shareTarget": {
    "Accommodation": 0.15
  },
  "estimateMonths": [
    {
      "label": "Mar",
      "scale": {
        "Flights": [
          "Feb",
          0.5
        ]
      }
    },
    {
      "label": "Apr",
      "zero": [
        "Coaching fees"
      ],
      "scale": {
        "Flights": [
          "Feb",
          0.5
        ],
        "Accommodation": [
          "Feb",
          0.5
        ]
      }
    },
    {
      "label": "May",
      "zero": [
        "Flights",
        "Accommodation",
        "Coaching fees",
        "Equipment"
      ],
      "exclude": [
        "Gym",
        "Gym fee"
      ]
    },
    "Jul",
    {
      "label": "Aug",
      "zero": [
        "Accommodation"
      ],
      "exclude": [
        "Charter boat"
      ]
    },
    {
      "label": "Sep",
      "zero": [
        "Flights"
      ],
      "scale": {
        "Accommodation": [
          "Feb",
          0.5
        ]
      },
      "factor": 0.5
    },
    {
      "label": "Oct",
      "zeroAll": true,
      "keep": [
        "Food"
      ]
    }
  ],
  "notice": "",
  "examples_note": "",
  "blurbs": {
    "Flights": "Regatta and training-camp travel",
    "Accommodation": "Rentals and hotels at venues",
    "Coaching fees": "Coach fees and coach travel",
    "Food": "Groceries and meals on the road",
    "Equipment": "Sails, charter boats and gear",
    "Registration": "Regatta entry fees and registrations",
    "Physio/gym": "Physio appointments, gym memberships",
    "Other": "Supplies and everyday extras"
  },
  "months": [
    {
      "label": "Jan",
      "spent": {
        "Flights": 1311.2,
        "Accommodation": 1200.0,
        "Coaching fees": 683.88,
        "Food": 525.9,
        "Equipment": 1874.81,
        "Registration": 524.71,
        "Physio/gym": 260.01,
        "Other": 82.33
      }
    },
    {
      "label": "Feb",
      "spent": {
        "Flights": 3084.0,
        "Accommodation": 675.62,
        "Coaching fees": 4147.57,
        "Food": 469.99,
        "Equipment": 2544.0,
        "Registration": 274.33,
        "Physio/gym": 500.18,
        "Other": 147.0
      }
    },
    {
      "label": "Jun",
      "noBaseline": true,
      "spent": {
        "Flights": 0,
        "Accommodation": 600.0,
        "Coaching fees": 280.0,
        "Food": 256.85,
        "Equipment": 675.0,
        "Registration": 0,
        "Physio/gym": 85.0,
        "Other": 0
      }
    }
  ],
  "examples": [
    {
      "label": "January 2026",
      "items": [
        {
          "date": "Jan 04",
          "vendor": "Flight to FL",
          "category": "Flights",
          "amount": 851.0,
          "receipt": ""
        },
        {
          "date": "Jan 04",
          "vendor": "LOCR fee",
          "category": "Registration",
          "amount": 524.71,
          "receipt": ""
        },
        {
          "date": "Jan 05",
          "vendor": "Coaching fees, Florida camp",
          "category": "Coaching fees",
          "amount": 683.88,
          "receipt": ""
        },
        {
          "date": "Jan 15",
          "vendor": "Grocery, day 1",
          "category": "Food",
          "amount": 186.07,
          "receipt": ""
        },
        {
          "date": "Jan 15",
          "vendor": "eSIM",
          "category": "Other",
          "amount": 44.55,
          "receipt": ""
        },
        {
          "date": "Jan 15",
          "vendor": "Charter boat",
          "category": "Equipment",
          "amount": 1874.81,
          "receipt": ""
        },
        {
          "date": "Jan 15",
          "vendor": "Accommodation, FL",
          "category": "Accommodation",
          "amount": 1200.0,
          "receipt": ""
        },
        {
          "date": "Jan 16",
          "vendor": "Post-sailing snack",
          "category": "Food",
          "amount": 17.85,
          "receipt": ""
        },
        {
          "date": "Jan 17",
          "vendor": "Grocery 2",
          "category": "Food",
          "amount": 58.2,
          "receipt": ""
        },
        {
          "date": "Jan 20",
          "vendor": "Pharmacy run",
          "category": "Other",
          "amount": 37.78,
          "receipt": ""
        },
        {
          "date": "Jan 20",
          "vendor": "Grocery 3",
          "category": "Food",
          "amount": 170.0,
          "receipt": ""
        },
        {
          "date": "Jan 22",
          "vendor": "Gym",
          "category": "Physio/gym",
          "amount": 60.0,
          "receipt": ""
        },
        {
          "date": "Jan 22",
          "vendor": "Protein powder + grocery 4",
          "category": "Food",
          "amount": 93.78,
          "receipt": ""
        },
        {
          "date": "Jan 25",
          "vendor": "Flight to YYZ",
          "category": "Flights",
          "amount": 460.2,
          "receipt": ""
        },
        {
          "date": "Jan 29",
          "vendor": "CSIO physio",
          "category": "Physio/gym",
          "amount": 200.01,
          "receipt": ""
        }
      ],
      "summary": "Back to sailing after a short break from injury. Training camp in Fort Lauderdale, plus the Lauderdale OCR regatta."
    },
    {
      "label": "February 2026",
      "items": [
        {
          "date": "Feb 01",
          "vendor": "Vilamoura accommodation 1",
          "category": "Accommodation",
          "amount": 288.17,
          "receipt": ""
        },
        {
          "date": "Feb 01",
          "vendor": "Vilamoura accommodation 2",
          "category": "Accommodation",
          "amount": 387.45,
          "receipt": ""
        },
        {
          "date": "Feb 01",
          "vendor": "Physio appointment",
          "category": "Physio/gym",
          "amount": 158.0,
          "receipt": ""
        },
        {
          "date": "Feb 02",
          "vendor": "Physio appointment",
          "category": "Physio/gym",
          "amount": 222.18,
          "receipt": ""
        },
        {
          "date": "Feb 04",
          "vendor": "Flight to Portugal",
          "category": "Flights",
          "amount": 1662.0,
          "receipt": ""
        },
        {
          "date": "Feb 05",
          "vendor": "Coaching fees",
          "category": "Coaching fees",
          "amount": 3224.62,
          "receipt": ""
        },
        {
          "date": "Feb 08",
          "vendor": "Grocery 1",
          "category": "Food",
          "amount": 131.96,
          "receipt": ""
        },
        {
          "date": "Feb 14",
          "vendor": "Team dinner",
          "category": "Food",
          "amount": 27.0,
          "receipt": ""
        },
        {
          "date": "Feb 14",
          "vendor": "Sails x4**",
          "category": "Equipment",
          "amount": 2544.0,
          "receipt": ""
        },
        {
          "date": "Feb 14",
          "vendor": "Grocery 2",
          "category": "Food",
          "amount": 88.0,
          "receipt": ""
        },
        {
          "date": "Feb 14",
          "vendor": "Oz flight to Hyeres",
          "category": "Coaching fees",
          "amount": 922.95,
          "receipt": "",
          "hidden": true
        },
        {
          "date": "Feb 14",
          "vendor": "Flight to Palma",
          "category": "Flights",
          "amount": 785.0,
          "receipt": "",
          "hidden": true
        },
        {
          "date": "Feb 15",
          "vendor": "Grocery 3",
          "category": "Food",
          "amount": 42.95,
          "receipt": ""
        },
        {
          "date": "Feb 15",
          "vendor": "Nice to Toronto",
          "category": "Flights",
          "amount": 637.0,
          "receipt": "",
          "hidden": true
        },
        {
          "date": "Feb 16",
          "vendor": "Decathlon/equipment",
          "category": "Other",
          "amount": 147.0,
          "receipt": ""
        },
        {
          "date": "Feb 16",
          "vendor": "Lunch",
          "category": "Food",
          "amount": 28.08,
          "receipt": ""
        },
        {
          "date": "Feb 22",
          "vendor": "Team Canada dinner",
          "category": "Food",
          "amount": 40.0,
          "receipt": ""
        },
        {
          "date": "Feb 23",
          "vendor": "Grocery 4",
          "category": "Food",
          "amount": 112.0,
          "receipt": ""
        },
        {
          "date": "Feb 24",
          "vendor": "Gym fee for camp 1/2",
          "category": "Physio/gym",
          "amount": 120.0,
          "receipt": ""
        },
        {
          "date": "Feb 25",
          "vendor": "Vilamoura Grand Prix registration",
          "category": "Registration",
          "amount": 274.33,
          "receipt": ""
        }
      ],
      "footnote": "Some travel booked in February for later trips is counted in the year’s total, not listed here.",
      "summary": "One training camp, one Team Canada training camp, and the Vilamoura Grand Prix regatta in Vilamoura, Portugal. Plus physio to rehab my ankle injury.\nSails x4** — my sails for the year, one-time charge."
    },
    {
      "label": "June 2026",
      "noBaseline": true,
      "items": [
        {
          "date": "Jun 08",
          "vendor": "Accommodation",
          "category": "Accommodation",
          "amount": 600.0,
          "receipt": ""
        },
        {
          "date": "Jun 09",
          "vendor": "Queen’s Athletics & Recreation (gym)",
          "category": "Physio/gym",
          "amount": 85.0,
          "receipt": ""
        },
        {
          "date": "Jun 09",
          "vendor": "Grocery 1 (Metro)",
          "category": "Food",
          "amount": 45.97,
          "receipt": ""
        },
        {
          "date": "Jun 10",
          "vendor": "Garmin watch",
          "category": "Equipment",
          "amount": 675.0,
          "receipt": ""
        },
        {
          "date": "Jun 12",
          "vendor": "Lunch + sailing snack",
          "category": "Food",
          "amount": 21.0,
          "receipt": ""
        },
        {
          "date": "Jun 13",
          "vendor": "Grocery 2",
          "category": "Food",
          "amount": 97.0,
          "receipt": ""
        },
        {
          "date": "Jun 17",
          "vendor": "Team dinner",
          "category": "Food",
          "amount": 17.87,
          "receipt": ""
        },
        {
          "date": "Jun 19",
          "vendor": "Grocery 3",
          "category": "Food",
          "amount": 53.0,
          "receipt": ""
        },
        {
          "date": "Jun 20",
          "vendor": "Lunch",
          "category": "Food",
          "amount": 22.01,
          "receipt": ""
        },
        {
          "date": "Jun 30",
          "vendor": "Coaching fees",
          "category": "Coaching fees",
          "amount": 280.0,
          "receipt": ""
        }
      ],
      "summary": "Three-week Team Canada training block in Kingston, plus a new Garmin watch!!"
    }
  ],
  "yearBudget": 62000
};
