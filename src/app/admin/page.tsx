import { getServerSession } from 'next-auth';
import { Col, Container, Row } from 'react-bootstrap';
import { prisma } from '@/lib/prisma';
import { adminProtectedPage } from '@/lib/page-protection';
import { Contact, Note } from '@prisma/client';
import ContactCardAdmin from '@/components/ContactCardAdmin';
import { authOptions } from '../api/auth/[...nextauth]/route';

const AdminPage = async () => {
  const session = await getServerSession(authOptions);
  adminProtectedPage(
    session as {
      user: { email: string; id: string; randomKey: string };
    } | null,
  );

  const contacts: Contact[] = await prisma.contact.findMany({});

  const notes: Note[] = await prisma.note.findMany({});

  return (
    <main>
      <Container id="list" fluid className="py-3">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center">List Contacts (Admin)</h1>
              <Row xs={1} md={2} lg={3} className="g-4">
                {contacts.map((contact) => (
                  <Col key={`${contact.firstName}-${contact.lastName}`}>
                    <ContactCardAdmin
                      contact={contact}
                      notes={notes.filter(note => (note.contactId === contact.id))}
                    />
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </Container>
    </main>
  );
};

export default AdminPage;
