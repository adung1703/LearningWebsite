import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import Submission from "./ViewOldSubmission.jsx";

const TabsDefault = (props) => {
    const {submissions} = props;

    const lastSubmission = submissions.submission_detail[0];
    
    const publicTestCases = lastSubmission.testcases.public.map((testCase) => (
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
    ));
    
    const privateTestCases = lastSubmission.testcases.private.map((testCase) => (
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
        </tr>
    ));
    
    const history = submissions.submission_detail.map((submission) => (
        <tr key={submission._id} className="hover:bg-slate-50">
            <td className="p-4 border-b border-r">
                <p className="text-sm">
                    {submission.score}
                </p>
            </td>
            <td className="p-4 border-b">
                <p className="text-sm font-bold">
                    {new Date(submission.submit_at).toLocaleString()}
                </p>
            </td>
            <td className="p-4 border-b">
                <Submission submission={submission}/>
                {/* <a className="text-sm font-semibold text-blue-700">
                    View
                </a> */}
            </td>
        </tr>
    ));
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
                        {publicTestCases}
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
                        {privateTestCases}
                    </tbody>
                </table>
            </div>
        },
        {
            label: "Lịch Sử Nộp Bài",
            value: "history",
            desc:
                <div className="relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
                    <table className="w-full text-left table-auto min-w-max text-slate-800">
                        <thead>
                            <tr className="text-slate-500 border-b border-r border-slate-300 bg-slate-50">
                                <th className="p-4 border-r">
                                    <p >
                                        Điểm
                                    </p>
                                </th>
                                <th className="p-4">
                                    <p >
                                        Thời gian
                                    </p>
                                </th>
                                <th className="p-4 border-r">
                                    <p>Xem chi tiết</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history}
                        </tbody>
                    </table>
                </div>
        }
    ];

    return (
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
    );
}

export default TabsDefault;