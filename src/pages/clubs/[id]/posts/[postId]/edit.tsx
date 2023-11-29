import { Anchor, Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { NotFound } from '~/components/AppLayout/NotFound';
import { PageLoader } from '~/components/PageLoader/PageLoader';
import { ModelVersionUpsertForm } from '~/components/Resource/Forms/ModelVersionUpsertForm';
import { useCurrentUser } from '~/hooks/useCurrentUser';
import { trpc } from '~/utils/trpc';
import { useClubContributorStatus } from '~/components/Club/club.utils';
import { ClubMembershipRole } from '@prisma/client';
import { ClubPostUpsertForm } from '~/components/Club/ClubPostUpsertForm';
import { useClubFeedStyles } from '~/components/Club/ClubFeed';

export default function ClubPostEdit() {
  const router = useRouter();
  const postId = Number(router.query.postId);
  const currentUser = useCurrentUser();
  const { data: clubPost, isLoading } = trpc.clubPost.getById.useQuery({
    id: postId,
  });

  const { isOwner, role } = useClubContributorStatus({
    clubId: clubPost?.clubId,
  });
  const { classes } = useClubFeedStyles();

  const isModerator = currentUser?.isModerator ?? false;

  const canUpdatePost =
    isModerator ||
    isOwner ||
    (clubPost.createdBy?.id === currentUser?.id && role === ClubMembershipRole.Contributor) ||
    role === ClubMembershipRole.Admin;

  if (isLoading) return <PageLoader />;
  if (!canUpdatePost) return <NotFound />;

  const handleClose = () => {
    router.push(`/clubs/${clubPost.clubId}`);
  };

  return (
    <Container size="md">
      <Stack spacing="xl">
        <Link href={`/clubs/${clubPost.clubId}`} passHref shallow>
          <Anchor size="sm">
            <Group spacing={4}>
              <IconArrowLeft size={18} strokeWidth={1.5} />
              <Text inherit>Back to club&rsquo;s page</Text>
            </Group>
          </Anchor>
        </Link>
        <Title order={1}>Edit Club Post</Title>
        <Paper className={classes.feedContainer}>
          <ClubPostUpsertForm
            clubId={clubPost.clubId}
            clubPost={clubPost}
            onSuccess={() => {
              handleClose();
            }}
          />
        </Paper>
      </Stack>
    </Container>
  );
}
