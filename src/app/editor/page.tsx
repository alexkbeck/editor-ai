import { Toaster } from 'sonner';

import { PlateEditor } from '@/components/editor/plate-editor';
import { Sidebar, SidebarBody } from '@/components/ui/sidebar';

const EditorSidebar = () => {
  return (
    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
      <div className="flex items-center space-x-2 py-4 px-2">
        <div className="h-6 w-7 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
        <span className="font-medium text-black dark:text-white text-sm">
          Editor
        </span>
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="h-screen w-full bg-gray-100 flex">
      <Sidebar>
        <SidebarBody>
          <EditorSidebar />
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex items-center justify-center p-2 min-w-0">
        <div className="w-full max-w-full h-[98%] bg-white rounded-md shadow-sm border border-gray-200 px-4 flex items-center justify-center">
          <div className="w-full max-w-4xl">
            <PlateEditor />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
