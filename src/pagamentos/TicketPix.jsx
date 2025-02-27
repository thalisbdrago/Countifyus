import { Dialog, DialogDescription,DialogContent,DialogHeader,DialogTitle,DialogFooter} from "@/components/ui/dialog"

export const TicketPix = ({ a }) => {
  return (
    <>
                  <Dialog>
                    <DialogContent>
                      <iframe          
                            src={a}
                            width="100%"
                            height="300"
                            style={{ border: '1px solid black' }}>
                      </iframe>
                    </DialogContent>
                  </Dialog>
    </>
  );
};

