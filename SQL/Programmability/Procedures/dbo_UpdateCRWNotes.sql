SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[UpdateCRWNotes]
(
@CRWNotesID int,
@Status varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		

	update CRWNotesNew set Status=@Status where CRWNotesID=@CRWNotesID;
    select 1;

END



GO