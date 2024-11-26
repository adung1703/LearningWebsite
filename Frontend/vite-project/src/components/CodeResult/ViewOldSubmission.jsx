import React from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

const data = [
  {
    label: "Test Case Công Khai",
    value: "public",
    desc: <div className="relative flex flex-col w-full h-full overflow-scroll text-slate-300 bg-slate-800 shadow-md rounded-lg bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Input
              </p>
            </th>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Expected Output
              </p>
            </th>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Your Output
              </p>
            </th>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Status
              </p>
            </th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>,
  },
  {
    label: "Test Case Ẩn",
    value: "private",
    desc: <div className="relative flex flex-col w-full h-full overflow-scroll text-slate-300 bg-slate-800 shadow-md rounded-lg bg-clip-border">
      <table className="w-full text-left table-auto min-w-max">
        <thead>
          <tr>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Input
              </p>
            </th>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Your Output
              </p>
            </th>
            <th className="p-4 border-b border-r border-slate-600 bg-slate-700">
              <p className="text-sm font-bold leading-none text-slate-300">
                Status
              </p>
            </th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
    </div>
  },
  {
    label: "Lịch Sử Nộp Bài",
    value: "history",
    desc:
      <div class="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
        <table class="w-full text-left table-auto min-w-max text-slate-800">
          <thead>
            <tr class="text-slate-500 border-b border-r border-slate-300 bg-slate-50">
              <th class="p-4 border-r">
                <p >
                  Điểm
                </p>
              </th>
              <th class="p-4">
                <p >
                  Thời gian
                </p>
              </th>
              <th class="p-4 border-r">
                <p>Xem chi tiết</p>
              </th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>
      </div>
  }
];

// const Tabs = (
//   <Tabs value="html">
//     <TabsHeader>
//       {data.map(({ label, value }) => (
//         <Tab key={value} value={value}>
//           <strong>{label}</strong>
//         </Tab>
//       ))}
//     </TabsHeader>
//     <hr style={{ borderTop: "1px solid black" }} />
//     <TabsBody>
//       {data.map(({ value, desc }) => (
//         <TabPanel key={value} value={value}>
//           {desc}
//         </TabPanel>
//       ))}
//     </TabsBody>
//   </Tabs>
// );

const submission = {
  "content": [
    "function sum(a, b) { return a + b;}"
  ],
  "testcases": {
    "public": [
      {
        "input": "3 5",
        "expected_output": "8\n",
        "output": "8\n",
        "status": "correct",
        "_id": "674472cdeca8fba85b3d016e"
      },
      {
        "input": "3 4",
        "expected_output": "7\n",
        "output": "7\n",
        "status": "correct",
        "_id": "674472cdeca8fba85b3d016f"
      },
      {
        "input": "1 5",
        "expected_output": "6\n",
        "output": "6\n",
        "status": "correct",
        "_id": "674472cdeca8fba85b3d0170"
      }
    ],
    "private": [
      {
        "status": "correct",
        "input": "7 8",
        "your_output": "15\n",
        "_id": "674472cdeca8fba85b3d0171"
      },
      {
        "status": "correct",
        "input": "0 0",
        "your_output": "0\n",
        "_id": "674472cdeca8fba85b3d0172"
      },
      {
        "status": "correct",
        "input": "-3 3",
        "your_output": "0\n",
        "_id": "674472cdeca8fba85b3d0173"
      },
      {
        "status": "correct",
        "input": "-5 -4",
        "your_output": "-9\n",
        "_id": "674472cdeca8fba85b3d0174"
      },
      {
        "status": "correct",
        "input": "10 25",
        "your_output": "35\n",
        "_id": "674472cdeca8fba85b3d0175"
      },
      {
        "status": "correct",
        "input": "123 456",
        "your_output": "579\n",
        "_id": "674472cdeca8fba85b3d0176"
      },
      {
        "status": "correct",
        "input": "1000 2000",
        "your_output": "3000\n",
        "_id": "674472cdeca8fba85b3d0177"
      },
      {
        "status": "correct",
        "input": "-1000 1000",
        "your_output": "0\n",
        "_id": "674472cdeca8fba85b3d0178"
      },
      {
        "status": "correct",
        "input": "99999 1",
        "your_output": "100000\n",
        "_id": "674472cdeca8fba85b3d0179"
      },
      {
        "status": "correct",
        "input": "-32768 32767",
        "your_output": "-1\n",
        "_id": "674472cdeca8fba85b3d017a"
      }
    ]
  },
  "submit_at": "2024-11-25T12:48:35.113Z",
  "score": 10,
  "_id": "674472cdeca8fba85b3d016d"
}

export default function Submission() {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <a className="text-sm font-semibold text-blue-700" onClick={handleOpen}>
        View
      </a>
      <Dialog open={open}
        handler={handleOpen}
      // className="max-w-screen-lg"
      >
        <DialogHeader>Điểm: {submission.score}</DialogHeader>
        <DialogBody>
          {/* // Tabs */}
          <Tabs value="html">
            <TabsHeader>
              {data.map(({ label, value }) => (
                <Tab key={value} value={value}>
                  <strong>{label}</strong>
                </Tab>
              ))}
            </TabsHeader>
            <hr style={{ borderTop: "1px solid black" }} />
            <TabsBody>
              {data.map(({ value, desc }) => (
                <TabPanel key={value} value={value}>
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </Tabs>
          {/* // Tabs */}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleOpen}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}