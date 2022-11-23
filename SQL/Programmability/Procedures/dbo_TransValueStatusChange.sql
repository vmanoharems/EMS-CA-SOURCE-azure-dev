SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[TransValueStatusChange]
(
@TransactionValueID int,
@Status bit
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	update  TransactionValue set Status=@Status where TransactionValueID=@TransactionValueID 

END




GO