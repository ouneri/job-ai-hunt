import prisma from "@/app/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany();
    return Response.json(applications);
  } catch (errror) {
    console.error(errror);
    return Response.json(
      { error: "Failed to fetch applications" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const application = await prisma.application.update({
      where: { id: data.id },
      data: { status: data.status },
    });

    return Response.json(application, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({error: 'Ошибка с изменением статуса'}, {status: 500})
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const application = await prisma.application.create({
      data: {
        name: data.name,
        title: data.title,
      },
    });

    return Response.json(application, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { error: "Failed to create application" },
      { status: 500 },
    );
  }
}
