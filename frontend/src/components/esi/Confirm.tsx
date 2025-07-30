import clsx from 'clsx';
import { confirmable, createConfirmation, type ConfirmDialogProps } from 'react-confirm';



const MyDialog = (
  { show, proceed, 
    title = 'Confirm', 
    message= 'Are you sure?' }: ConfirmDialogProps<{
    title: string, message: string
  }, boolean>) => (
  <div id="popupModal" className={clsx("fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50", !show && 'hidden')}>
    {/* <!-- Modal Box --> */}
    <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <p className="text-gray-700 mb-4">{message}</p>
      <div className="flex justify-end space-x-2">
        <button onClick={() => proceed(false)} className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-500 rounded">
          Cancel
        </button>
        <button onClick={() => proceed(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export const confirm = createConfirmation(confirmable(MyDialog));