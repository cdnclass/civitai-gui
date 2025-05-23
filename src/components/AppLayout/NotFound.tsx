import { Box, Button, Container, Stack, Text, Title, Skeleton } from '@mantine/core';
import { NextLink as Link } from '~/components/NextLink/NextLink';
import { useMemo } from 'react';
import { EdgeMedia } from '~/components/EdgeMedia/EdgeMedia';
import { Meta } from '~/components/Meta/Meta';
import { useIsClient } from '~/providers/IsClientProvider';
import { trpc } from '~/utils/trpc';

export function NotFound() {
  const isClient = useIsClient();
  const { data: images } = trpc.image.get404Images.useQuery(undefined, {
    enabled: isClient,
    trpc: { context: { skipBatch: true } },
  });

  const image = useMemo(() => {
    if (!images || !images.length) return;

    const [username, url, alt] = images[Math.floor(Math.random() * images.length)];
    return { username, url, alt };
  }, [images]);

  return (
    <>
      <Meta title="Page Not Found" deIndex />

      <Container size="md">
        <Stack align="center" spacing={0}>
          <Title order={1} lh={1}>
            404
          </Title>
          <Text size="lg">The page you are looking for doesn&apos;t exist</Text>

          <Stack spacing={4} my="xl">
            <Box
              sx={(theme) => ({
                height: 400,
                display: 'flex',
                img: {
                  margin: '0 auto',
                  height: '100%',
                  width: 'auto',
                  borderRadius: theme.radius.sm,
                  boxShadow: theme.shadows.md,
                },
              })}
            >
              {image ? (
                <EdgeMedia src={image.url} width={700} alt={image.alt} />
              ) : (
                <Skeleton height={400} width={400}></Skeleton>
              )}
            </Box>
            {image ? (
              <Text size="xs" ta="center">
                Generated by{' '}
                <Text component={Link} href={`/user/${image.username}`} td="underline">
                  {image.username}
                </Text>{' '}
                as part of the{' '}
                <Text component={Link} href="/collections/104601" td="underline">
                  404 Contest
                </Text>{' '}
                November 2023.
              </Text>
            ) : (
              <Text size="xs" ta="center">
                Loading a special 404 image from our{' '}
                <Text component={Link} href="/collections/104601" td="underline">
                  404 Contest
                </Text>
                ...
              </Text>
            )}
          </Stack>

          <Button component={Link} href="/" size="md">
            Go back home
          </Button>
        </Stack>
      </Container>
    </>
  );
}
