import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size={'4xl'}>
      <ModalOverlay p={[4, 8]}>
        <ModalContent w="max-content">
          <ModalBody p="0">
            <Image
              src={imgUrl}
              alt="Modal showing the photo with zoom in"
              maxW="900px"
              maxH="600px"
              w="100%"
              objectFit="contain"
            />
          </ModalBody>

          <ModalFooter bg="pGray.800" h="8">
            <Link w="100%" href={imgUrl} justifySelf="flex-start">
              Abrir original
            </Link>
          </ModalFooter>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
}
