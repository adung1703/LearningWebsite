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