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

const Submission = (props) => {
  // const submission = {
  //   "content": [
  //     "function sum(a, b) { return a + b;}"
  //   ],
  //   "testcases": {
  //     "public": [
  //       {
  //         "input": "3 5",
  //         "expected_output": "8\n",
  //         "output": "8\n",
  //         "status": "correct",
  //         "_id": "674472cdeca8fba85b3d016e"
  //       },
  //       {
  //         "input": "3 4",
  //         "expected_output": "7\n",
  //         "output": "7\n",
  //         "status": "correct",
  //         "_id": "674472cdeca8fba85b3d016f"
  //       },
  //       {
  //         "input": "1 5",
  //         "expected_output": "6\n",
  //         "output": "6\n",
  //         "status": "correct",
  //         "_id": "674472cdeca8fba85b3d0170"
  //       }
  //     ],
  //     "private": [
  //       {
  //         "status": "correct",
  //         "input": "7 8",
  //         "your_output": "15\n",
  //         "_id": "674472cdeca8fba85b3d0171"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "0 0",
  //         "your_output": "0\n",
  //         "_id": "674472cdeca8fba85b3d0172"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "-3 3",
  //         "your_output": "0\n",
  //         "_id": "674472cdeca8fba85b3d0173"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "-5 -4",
  //         "your_output": "-9\n",
  //         "_id": "674472cdeca8fba85b3d0174"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "10 25",
  //         "your_output": "35\n",
  //         "_id": "674472cdeca8fba85b3d0175"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "123 456",
  //         "your_output": "579\n",
  //         "_id": "674472cdeca8fba85b3d0176"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "1000 2000",
  //         "your_output": "3000\n",
  //         "_id": "674472cdeca8fba85b3d0177"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "-1000 1000",
  //         "your_output": "0\n",
  //         "_id": "674472cdeca8fba85b3d0178"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "99999 1",
  //         "your_output": "100000\n",
  //         "_id": "674472cdeca8fba85b3d0179"
  //       },
  //       {
  //         "status": "correct",
  //         "input": "-32768 32767",
  //         "your_output": "-1\n",
  //         "_id": "674472cdeca8fba85b3d017a"
  //       }
  //     ]
  //   },
  //   "submit_at": "2024-11-25T12:48:35.113Z",
  //   "score": 10,
  //   "_id": "674472cdeca8fba85b3d016d"
  // }
  const { submission } = props;
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
            {
              submission.testcases.public.map((testCase) => (
                <tr className="hover:bg-slate-700" key={testCase._id}>
                  <td className="p-4 border-b border-r border-slate-700">
                    <p className="text-sm text-slate-100 font-semibold">
                      {testCase.input.split('\n').map((line, index) => (
                        <span key={index}>{line}<br /></span>
                      ))}
                    </p>
                  </td>
                  <td className="p-4 border-b border-r border-slate-700">
                    <p className="text-sm text-slate-300">
                      {testCase.expected_output}
                    </p>
                  </td>
                  <td className="p-4 border-b border-r border-slate-700">
                    <p className="text-sm text-slate-300">
                      {testCase.output}
                    </p>
                  </td>
                  <td className="p-4 border-b border-r border-slate-700">
                    <p className={`text-sm ${testCase.status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                      {testCase.status}
                    </p>
                  </td>
                </tr>
              ))
            }
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
            {submission.testcases.private.map((testCase) => (
              <tr className="hover:bg-slate-700" key={testCase._id}>
                <td className="p-4 border-b border-r border-slate-700">
                  <p className="text-sm text-slate-100 font-semibold">
                    {testCase.input}
                  </p>
                </td>
                <td className="p-4 border-b border-r border-slate-700">
                  <p className="text-sm text-slate-300">
                    {testCase.your_output}
                  </p>
                </td>
                <td className="p-4 border-b border-r border-slate-700">
                  <p className={`text-sm ${testCase.status === 'correct' ? 'text-green-500' : 'text-red-500'}`}>
                    {testCase.status}
                  </p>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    }
  ];
  const contents = (
    <Tabs value="html">
      <TabsHeader>
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            <strong>{label}</strong>
          </Tab>
        ))}
      </TabsHeader>
      <hr style={{ borderTop: "1px solid black" }} />
      <TabsBody className="relative overflow-y-auto h-[55vh]">
        {data.map(({ value, desc }) => (
          <TabPanel key={value} value={value}>
            {desc}
          </TabPanel>
        ))}
      </TabsBody>
    </Tabs>
  );

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <a className="text-sm font-semibold text-blue-700" onClick={handleOpen}>
        View
      </a>
      <Dialog open={open}
        handler={handleOpen}
        className="w-10/12 h-5/6 bg-cyan-50 fixed mx-auto inset-0 items-center justify-center "
      >
        <DialogHeader>Điểm: {submission.score}</DialogHeader>
        <DialogBody>
          {contents}
        </DialogBody>
        <DialogFooter className="">
          <Button
            variant="text"
            color="white"
            onClick={handleOpen}
            className="mr-1 mb-2 bg-red-800"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Submission;